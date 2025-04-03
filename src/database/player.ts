import { ObjectId, WithId } from "mongodb";
import { collections, getDatabase } from "./mongodb";
import { Player } from "../types/player";

export async function getAllPlayers(): Promise<WithId<Player>[]> {
  const db = await getDatabase();
  const collection = db.collection<Player>(collections.PLAYERS);
  const players = await collection.find().toArray();
  return players;
}

export async function getPlayerById(
  playerId: ObjectId | string,
): Promise<WithId<Player>> {
  const db = await getDatabase();
  const collection = db.collection<Player>(collections.PLAYERS);
  const player = await collection.findOne({ _id: new ObjectId(playerId) });
  if (!player) {
    throw new Error(`Player with ID ${playerId} not found`);
  }
  return player;
}
