"use server";
import { doServerAction, doServerActionWithAuth } from "@/lib/actions";
import { getClient } from "@/lib/dbclient";
import { Players } from "@/lib/prisma/generated";
import {
  PaginationResponse,
  ServerError,
  ServerResponse,
} from "@/types/responses";
import { ObjectId } from "mongodb";

export async function getAllPlayers(): Promise<ServerResponse<Players[]>> {
  return doServerAction(async () => {
    const db = getClient();
    const players = await db.players.findMany({
      where: {
        deletedAt: null,
      },
    });

    return players;
  });
}

export async function getPlayerCount(): Promise<ServerResponse<number>> {
  return doServerAction(async () => {
    const db = getClient();
    return db.players.count({
      where: {
        deletedAt: null,
      },
    });
  });
}

export async function getNewPlayersCount(
  days: number,
): Promise<ServerResponse<number>> {
  return doServerAction(async () => {
    const db = getClient();
    const date = new Date();
    date.setDate(date.getDate() - days);
    const count = await db.players.count({
      where: {
        createdAt: { gt: date },
        deletedAt: null,
      },
    });
    return count;
  });
}

export async function getPlayersPaginated(
  pagination: { skip: number; limit: number },
  sorting: { field: string; order: string },
  filter?: string,
): Promise<ServerResponse<PaginationResponse<Players>>> {
  return doServerAction(async () => {
    const db = getClient();

    const totalCount = await db.players.count({
      where: {
        deletedAt: null,
        ...(filter && {
          OR: [
            { login: { contains: filter, mode: "insensitive" } },
            { nickName: { contains: filter, mode: "insensitive" } },
            { ubiUid: { contains: filter, mode: "insensitive" } },
            { path: { contains: filter, mode: "insensitive" } },
          ],
        }),
      },
    });

    const players = await db.players.findMany({
      where: {
        deletedAt: null,
        ...(filter && {
          OR: [
            { login: { contains: filter, mode: "insensitive" } },
            { nickName: { contains: filter, mode: "insensitive" } },
            { ubiUid: { contains: filter, mode: "insensitive" } },
            { path: { contains: filter, mode: "insensitive" } },
          ],
        }),
      },
      skip: pagination.skip,
      take: pagination.limit,
      orderBy: {
        [sorting.field]: sorting.order.toLowerCase() as "asc" | "desc",
      },
    });

    return {
      data: players,
      totalCount,
    };
  });
}

export async function getPlayerById(
  id: string,
): Promise<ServerResponse<Players>> {
  return doServerAction(async () => {
    const db = getClient();
    const player = await db.players.findUniqueOrThrow({
      where: {
        id,
        deletedAt: null,
      },
    });

    return player;
  });
}

export async function getPlayerByLogin(
  login: string,
): Promise<ServerResponse<Players>> {
  return doServerAction(async () => {
    const db = getClient();
    console.log(login);
    const player = await db.players.findFirstOrThrow({
      where: {
        login,
        deletedAt: null,
      },
    });

    return player;
  });
}

export async function createPlayerAuth(
  player: Omit<Players, "id" | "createdAt" | "updatedAt" | "deletedAt">,
): Promise<ServerResponse<Players>> {
  return doServerAction(async () => {
    const db = getClient();

    const existingPlayer = await db.players.findFirst({
      where: {
        OR: [
          { login: player.login },
          { nickName: player.nickName },
          { ubiUid: player.ubiUid },
        ],
      },
    });

    if (existingPlayer) {
      throw new ServerError(
        "Player with this login or nickname already exists",
      );
    }

    const newPlayer = {
      ...player,
      id: new ObjectId().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    const result = await db.players.create({
      data: newPlayer,
    });

    if (!result) {
      throw new ServerError("Failed to create player");
    }

    return result;
  });
}

export async function updatePlayer(
  id: string,
  data: Omit<
    Players,
    | "id"
    | "login"
    | "nickName"
    | "path"
    | "ubiUid"
    | "createdAt"
    | "updatedAt"
    | "deletedAt"
  >,
): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async (session) => {
    if (id === session.user.id) {
      throw new ServerError("Cannot update your own account");
    }

    const db = getClient();

    const existingPlayer = await db.players.findUniqueOrThrow({
      where: {
        id,
      },
    });

    const isRemovingAdmin =
      existingPlayer.roles?.includes("admin") && !data.roles?.includes("admin");

    if (isRemovingAdmin) {
      throw new ServerError("Cannot remove admin role");
    }

    await db.players.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
        deletedAt: null,
      },
    });
  });
}

export async function deletePlayerById(id: string): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async (session) => {
    if (id === session.user.id) {
      throw new ServerError("Cannot delete your own account");
    }

    const db = getClient();
    await db.players.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        updatedAt: new Date(),
      },
    });
  });
}
