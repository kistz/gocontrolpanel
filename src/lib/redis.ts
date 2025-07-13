import Redis from "ioredis";
import config from "./config";
import { appGlobals } from "./global";
import "server-only";

export async function connectToRedis() {
  if (appGlobals.redis) {
    return appGlobals.redis;
  }

  try {
    const client = new Redis(config.REDISURI, {
      retryStrategy: () => null,
      maxRetriesPerRequest: 1,
      reconnectOnError: () => false,
    });

    console.log("Redis client initialized");

    appGlobals.redis = client;
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

export const getKeyActiveMap = (serverUuid: string) =>
  `active-map:${serverUuid}`;
export const getKeyJukebox = (serverUuid: string) => `jukebox:${serverUuid}`;
export const getKeyPlayers = (serverUuid: string) => `players:${serverUuid}`;
export const getKeyHetznerRateLimit = (projectId: string) =>
  `hetzner-rate-limit:${projectId}`;
export const getKeyHetznerServerTypes = () => "hetzner-server-types";
export const getKeyHetznerImages = () => "hetzner-images";
export const getKeyHetznerLocations = () => "hetzner-locations";
