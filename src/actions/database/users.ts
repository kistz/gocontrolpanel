"use server";
import { doServerAction, doServerActionWithAuth } from "@/lib/actions";
import { getClient } from "@/lib/dbclient";
import { Users } from "@/lib/prisma/generated";
import {
  PaginationResponse,
  ServerError,
  ServerResponse,
} from "@/types/responses";

export async function getAllUsers(): Promise<ServerResponse<Users[]>> {
  return doServerAction(async () => {
    const db = getClient();
    const users = await db.users.findMany({
      where: {
        deletedAt: null,
      },
    });

    return users;
  });
}

export async function getUserCount(): Promise<ServerResponse<number>> {
  return doServerAction(async () => {
    const db = getClient();
    return db.users.count({
      where: {
        deletedAt: null,
      },
    });
  });
}

export async function getNewUsersCount(
  days: number,
): Promise<ServerResponse<number>> {
  return doServerAction(async () => {
    const db = getClient();
    const date = new Date();
    date.setDate(date.getDate() - days);
    const count = await db.users.count({
      where: {
        createdAt: { gt: date },
        deletedAt: null,
      },
    });
    return count;
  });
}

export async function getUsersPaginated(
  pagination: { skip: number; limit: number },
  sorting: { field: string; order: string },
  filter?: string,
): Promise<ServerResponse<PaginationResponse<Users>>> {
  return doServerAction(async () => {
    const db = getClient();

    const totalCount = await db.users.count({
      where: {
        deletedAt: null,
        ...(filter && {
          OR: [
            { login: { contains: filter } },
            { nickName: { contains: filter } },
            { ubiUid: { contains: filter } },
            { path: { contains: filter } },
          ],
        }),
      },
    });

    const users = await db.users.findMany({
      where: {
        deletedAt: null,
        ...(filter && {
          OR: [
            { login: { contains: filter } },
            { nickName: { contains: filter } },
            { ubiUid: { contains: filter } },
            { path: { contains: filter } },
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
      data: users,
      totalCount,
    };
  });
}

export async function getUserById(id: string): Promise<ServerResponse<Users>> {
  return doServerAction(async () => {
    const db = getClient();
    const user = await db.users.findUniqueOrThrow({
      where: {
        id,
        deletedAt: null,
      },
    });

    return user;
  });
}

export async function getUserByLogin(
  login: string,
): Promise<ServerResponse<Users>> {
  return doServerAction(async () => {
    const db = getClient();
    const user = await db.users.findFirstOrThrow({
      where: {
        login,
        deletedAt: null,
      },
    });

    return user;
  });
}

export async function createUserAuth(
  user: Omit<Users, "id" | "createdAt" | "updatedAt" | "deletedAt">,
): Promise<ServerResponse<Users>> {
  return doServerAction(async () => {
    const db = getClient();

    const existingUser = await db.users.findFirst({
      where: {
        OR: [
          { login: user.login },
          { nickName: user.nickName },
          { ubiUid: user.ubiUid },
        ],
      },
    });

    if (existingUser) {
      throw new ServerError("User with this login or nickname already exists");
    }

    const newUser = {
      ...user,
      admin: user.admin,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    const result = await db.users.create({
      data: newUser,
    });

    if (!result) {
      throw new ServerError("Failed to create user");
    }

    return result;
  });
}

export async function updateUser(
  id: string,
  data: Omit<
    Users,
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
  return doServerActionWithAuth(["admin"], async () => {
    const db = getClient();

    const existingUser = await db.users.findUniqueOrThrow({
      where: {
        id,
      },
    });

    const isRemovingAdmin = existingUser.admin && !data.admin;

    if (isRemovingAdmin) {
      throw new ServerError("Cannot remove admin role");
    }

    await db.users.update({
      where: { id },
      data: {
        ...data,
        admin: data.admin,
        updatedAt: new Date(),
        deletedAt: null,
      },
    });
  });
}

export async function deleteUserById(id: string): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async (session) => {
    if (id === session.user.id) {
      throw new ServerError("Cannot delete your own account");
    }

    const db = getClient();
    await db.users.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        updatedAt: new Date(),
      },
    });
  });
}
