import Redis from "ioredis";
import config from "./config";
import { appGlobals } from "./global";
import "server-only";

export async function getRedisClient() {
  if (!appGlobals.redis) {
    try {
      appGlobals.redis = new Redis(config.REDISURI, {
        retryStrategy: () => null,
        maxRetriesPerRequest: 1,
        reconnectOnError: () => false,
      });

      console.log("Redis client initialized");
      return appGlobals.redis;
    } catch (error) {
      if (process.env.NODE_ENV === "production") {
        console.warn("Redis not available during build, continuing...");
      } else {
        console.error("Error connecting to Redis:", error);
        throw new Error("Failed to connect to Redis");
      }
    }
  }

  if (!appGlobals.redis) {
    throw new Error("Redis client is not initialized");
  }

  return appGlobals.redis;
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
