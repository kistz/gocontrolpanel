import { Config } from "@/types/config";
import "dotenv/config";

const config: Config = {
  MONGODB: {
    URI: process.env.MONGODB_URI || "",
    DB: process.env.MONGODB_DB || "nadeo",
  },
  NODE_ENV: process.env.NODE_ENV || "development",
  CONNECTOR_URL: process.env.CONNECTOR_URL || "http://localhost:6980",
  DEFAULT_ADMINS: process.env.DEFAULT_ADMINS
    ? process.env.DEFAULT_ADMINS.split(",")
    : [],
  CONNECTOR_API_KEY: process.env.CONNECTOR_API_KEY || "",
  NADEO: {
    CLIENT_ID: process.env.NADEO_CLIENT_ID || "",
    CLIENT_SECRET: process.env.NADEO_CLIENT_SECRET || "",
    REDIRECT_URI: process.env.NADEO_REDIRECT_URI || "",
    SERVER_LOGIN: process.env.NADEO_SERVER_LOGIN || "",
    SERVER_PASSWORD: process.env.NADEO_SERVER_PASSWORD || "",
    CONTACT: process.env.NADEO_CONTACT || "",
  },
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
