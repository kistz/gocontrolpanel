"use server";
import { auth } from "@/lib/auth";
import { ObjectId } from "mongodb";
import { DBPlayer, Player } from "../types/player";
import { collections, getDatabase } from "./mongodb";

export async function getAllPlayers(): Promise<Player[]> {
  const db = await getDatabase();
  const collection = db.collection<DBPlayer>(collections.PLAYERS);
  const players = await collection.find().toArray();
  return players.map((player) => mapDBPlayerToPlayer(player));
}

export async function getPlayersPaginated(
  pagination: { skip: number; limit: number },
  sorting: { field: string; order: string },
): Promise<{ data: Player[]; totalCount: number }> {
  const db = await getDatabase();
  const collection = db.collection<DBPlayer>(collections.PLAYERS);
  const totalCount = await collection.countDocuments();
  const players = await collection
    .find()
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
  const player = await collection.findOne({ _id: new ObjectId(playerId) });
  if (!player) {
    throw new Error(`Player not found`);
  }
  return mapDBPlayerToPlayer(player);
}

export async function getPlayerByLogin(login: string): Promise<Player | null> {
  const db = await getDatabase();
  const collection = db.collection<DBPlayer>(collections.PLAYERS);
  const player = await collection.findOne({ login });
  if (!player) {
    return null;
  }
  return mapDBPlayerToPlayer(player);
}

export async function deletePlayerById(
  playerId: ObjectId | string,
): Promise<void> {
  const session = await auth();
  if (!session) {
    throw new Error("Not authenticated");
  }

  if (!session.user.roles.includes("admin")) {
    throw new Error("Not authorized");
  }

  if (playerId === session.user._id) {
    throw new Error("Cannot delete your own account");
  }

  const db = await getDatabase();
  const collection = db.collection<DBPlayer>(collections.PLAYERS);
  const result = await collection.deleteOne({ _id: new ObjectId(playerId) });
  if (result.deletedCount === 0) {
    throw new Error(`Player not found`);
  }
}

function mapDBPlayerToPlayer(dbPlayer: DBPlayer): Player {
  return {
    ...dbPlayer,
    _id: dbPlayer._id.toString(),
  };
}
