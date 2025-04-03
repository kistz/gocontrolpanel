import { MongoClient } from "mongodb";
import config from "@/lib/config";

let cachedClient: MongoClient | null = null;

export async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }

  const client = new MongoClient(config.MONGODB_URI);
  await client.connect();

  cachedClient = client;
  return client;
}

export async function getDatabase() {
  const client = await connectToDatabase();
  const db = client.db(config.MONGODB_DB);
  return db;
}

// This is a list of collections in the database
export const collections = {
  PLAYERS: "players",
  MAPS: "maps",
  RECORDINGS: "recordings",
};
