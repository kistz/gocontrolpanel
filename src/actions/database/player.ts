"use server";
import { withAuth } from "@/lib/auth";
import { ObjectId } from "mongodb";
import { DBPlayer, Player } from "../../types/player";
import { collections, getDatabase } from "./mongodb";

export async function getAllPlayers(): Promise<Player[]> {
  const db = await getDatabase();
  const collection = db.collection<DBPlayer>(collections.PLAYERS);
  const players = await collection
    .find({
      deletedAt: { $exists: false },
    })
    .toArray();
  return players.map((player) => mapDBPlayerToPlayer(player));
}

export async function getPlayerCount(): Promise<number> {
  const db = await getDatabase();
  const collection = db.collection<DBPlayer>(collections.PLAYERS);
  return collection.countDocuments({
    deletedAt: { $exists: false },
  });
}

export async function getNewPlayersCount(days: number): Promise<number> {
  const db = await getDatabase();
  const collection = db.collection<DBPlayer>(collections.PLAYERS);
  const date = new Date();
  date.setDate(date.getDate() - days);
  const count = await collection.countDocuments({
    createdAt: { $gte: date },
    deletedAt: { $exists: false },
  });
  return count;
}

export async function getPlayersPaginated(
  pagination: { skip: number; limit: number },
  sorting: { field: string; order: string },
  filter?: string,
): Promise<{ data: Player[]; totalCount: number }> {
  const db = await getDatabase();
  const collection = db.collection<DBPlayer>(collections.PLAYERS);
  const totalCount = await collection.countDocuments({
    deletedAt: { $exists: false },
    ...(filter && {
      $or: [
        { login: { $regex: filter, $options: "i" } },
        { nickname: { $regex: filter, $options: "i" } },
        { ubiUid: { $regex: filter, $options: "i" } },
        { path: { $regex: filter, $options: "i" } },
      ],
    }),
  });
  const players = await collection
    .find({
      deletedAt: { $exists: false },
      ...(filter && {
        $or: [
          { login: { $regex: filter, $options: "i" } },
          { nickname: { $regex: filter, $options: "i" } },
          { ubiUid: { $regex: filter, $options: "i" } },
          { path: { $regex: filter, $options: "i" } },
        ],
      }),
    })
    .skip(pagination.skip)
    .limit(pagination.limit)
    .sort({ [sorting.field]: sorting.order === "ASC" ? 1 : -1 })
    .toArray();

  return {
    data: players.map((player) => mapDBPlayerToPlayer(player)),
    totalCount,
  };
}

export async function getPlayerById(
  playerId: ObjectId | string,
): Promise<Player> {
  const db = await getDatabase();
  const collection = db.collection<DBPlayer>(collections.PLAYERS);
  const player = await collection.findOne({
    _id: new ObjectId(playerId),
    deletedAt: { $exists: false },
  });
  if (!player) {
    throw new Error(`Player not found`);
  }
  return mapDBPlayerToPlayer(player);
}

export async function getPlayerByLogin(login: string): Promise<Player | null> {
  const db = await getDatabase();
  const collection = db.collection<DBPlayer>(collections.PLAYERS);
  const player = await collection.findOne({
    login,
    deletedAt: { $exists: false },
  });
  if (!player) {
    return null;
  }
  return mapDBPlayerToPlayer(player);
}

export async function deletePlayerById(
  playerId: ObjectId | string,
): Promise<void> {
  const session = await withAuth(["admin"]);

  if (playerId === session.user._id) {
    throw new Error("Cannot delete your own account");
  }

  const db = await getDatabase();
  const collection = db.collection<DBPlayer>(collections.PLAYERS);
  const result = await collection.updateOne(
    { _id: new ObjectId(playerId) },
    { $set: { deletedAt: new Date() } },
  );
  if (result.modifiedCount === 0) {
    throw new Error(`Player not found`);
  }
}

function mapDBPlayerToPlayer(dbPlayer: DBPlayer): Player {
  return {
    ...dbPlayer,
    _id: dbPlayer._id.toString(),
  };
}
