import config from "@/lib/config";
import { MongoClient } from "mongodb";

let cachedClient: MongoClient | null = null;

export async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }

  const client = new MongoClient(config.MONGODB.URI);
  await client.connect();

  cachedClient = client;
  return client;
}

export async function getDatabase() {
  const client = await connectToDatabase();
  const db = client.db(config.MONGODB.DB);
  return db;
}

// This is a list of collections in the database
export const collections = {
  PLAYERS: "players",
  MAPS: "maps",
  RECORDINGS: "recordings",
  RECORDS: "records",
};
