import { ObjectId } from "mongodb";
import { DBPlayer, Player } from "../types/player";
import { collections, getDatabase } from "./mongodb";

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

function mapDBPlayerToPlayer(dbPlayer: DBPlayer): Player {
  return {
    ...dbPlayer,
    _id: dbPlayer._id.toString(),
  };
}
