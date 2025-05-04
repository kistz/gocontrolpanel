import Redis from "ioredis";
import config from "./config";

let cachedClient: Redis | null = null;

export async function connectToRedis() {
  if (cachedClient) {
    return cachedClient;
  }

  try {
    const client = new Redis(config.REDISURI);
    cachedClient = client;
    return client;
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      console.warn("Redis not available during build, continuing...");
    } else {
      console.error("Error connecting to Redis:", error);
      throw new Error("Failed to connect to Redis");
    }
  }
}

export async function getRedisClient() {
  const client = await connectToRedis();
  if (!client) {
    throw new Error("Failed to connect to Redis");
  }
  return client;
}
