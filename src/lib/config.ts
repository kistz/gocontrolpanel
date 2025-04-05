import "dotenv/config";

export const config = {
  MONGODB_URI: process.env.MONGODB_URI || "",
  MONGODB_DB: process.env.MONGODB_DB || "",
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 3000,
  JWT_SECRET: process.env.JWT_SECRET || "secret",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1h",
  NADEO_CLIENT_ID: process.env.NADEO_CLIENT_ID || "",
  NADEO_CLIENT_SECRET: process.env.NADEO_CLIENT_SECRET || "",
  NADEO_REDIRECT_URI: process.env.NADEO_REDIRECT_URI || "",
};

if (!config.MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

if (!config.NADEO_CLIENT_ID || !config.NADEO_CLIENT_SECRET || !config.NADEO_REDIRECT_URI) {
  throw new Error("Please define the needed NADEO environment variables");
}

export default config;
