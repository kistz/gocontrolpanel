import { Config, Server } from "@/types/config";
import "dotenv/config";
import isLocalhost from "is-localhost-ip";
import SERVERS from "../../servers.json";

(async () => {
  for (const server of SERVERS as Server[]) {
    server.isLocal = await isLocalhost(server.host, true);
  }
})();

const config: Config = {
  MONGODB: {
    URI: process.env.MONGODB_URI || "",
    DB: process.env.MONGODB_DB || "nadeo",
  },
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  NADEO: {
    CLIENT_ID: process.env.NADEO_CLIENT_ID || "",
    CLIENT_SECRET: process.env.NADEO_CLIENT_SECRET || "",
    REDIRECT_URI: process.env.NADEO_REDIRECT_URI || "",
  },
  SERVERS,
  REDISURI: process.env.REDIS_URI || "",
};

if (!config.MONGODB.URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

if (
  !config.NADEO.CLIENT_ID ||
  !config.NADEO.CLIENT_SECRET ||
  !config.NADEO.REDIRECT_URI
) {
  throw new Error("Please define the needed NADEO environment variables");
}

export default config;
