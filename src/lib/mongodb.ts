import config from "@/lib/config";
import { MongoClient } from "mongodb";

let cachedClient: MongoClient | null = null;

export async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }

  try {
    const client = new MongoClient(config.MONGODB.URI);
    await client.connect();

    cachedClient = client;
    return client;
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      console.warn("MongoDB not available during build, continuing...");
    } else {
      console.error("Error connecting to Redis:", error);
      throw new Error("Failed to connect to Redis");
    }
  }
}

export async function getDatabase() {
  const client = await connectToDatabase();
  if (!client) {
    throw new Error("Failed to connect to database");
  }

  const db = client.db(config.MONGODB.DB);
  return db;
}

// This is a list of collections in the database
export const collections = {
  PLAYERS: "players",
  MAPS: "maps",
};
