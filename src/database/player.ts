"use server";
import { ObjectId } from "mongodb";
import { DBPlayer, Player } from "../types/player";
import { collections, getDatabase } from "./mongodb";
import { getServerSession } from "next-auth";

export async function getAllPlayers(): Promise<Player[]> {
  const db = await getDatabase();
  const collection = db.collection<DBPlayer>(collections.PLAYERS);
  const players = await collection.find().toArray();
  return players.map((player) => mapDBPlayerToPlayer(player));
}

export async function getPlayerById(
  playerId: ObjectId | string,
): Promise<Player> {
  const db = await getDatabase();
  const collection = db.collection<DBPlayer>(collections.PLAYERS);
  const player = await collection.findOne({ _id: new ObjectId(playerId) });
  if (!player) {
    throw new Error(`Player with ID ${playerId} not found`);
  }
  return mapDBPlayerToPlayer(player);
}

export async function getPlayerByLogin(
  login: string,
): Promise<Player | null> {
  const db = await getDatabase();
  const collection = db.collection<DBPlayer>(collections.PLAYERS);
  const player = await collection.findOne({ login });
  if (!player) {
    return null;
  }
  return mapDBPlayerToPlayer(player);
}

export async function deletePlayerById(playerId: ObjectId | string): Promise<void> {
  const session = await getServerSession();
  const db = await getDatabase();
  const collection = db.collection<DBPlayer>(collections.PLAYERS);
  console.log("Deleting player with ID:", playerId);
  // const result = await collection.deleteOne({ _id: new ObjectId(playerId) });
  // if (result.deletedCount === 0) {
  //   throw new Error(`Player with ID ${playerId} not found`);
  // }
}

function mapDBPlayerToPlayer(dbPlayer: DBPlayer): Player {
  return {
    ...dbPlayer,
    _id: dbPlayer._id.toString(),
  };
}
