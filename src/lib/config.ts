import "dotenv/config";

interface Config {
  MONGODB: {
    URI: string;
    DB: string;
  },
  NODE_ENV: string;
  PORT: number;
  NADEO: {
    CLIENT_ID: string;
    CLIENT_SECRET: string;
    REDIRECT_URI: string;
  },
  XMLRPC: {
    HOST: string;
    PORT: number;
    USER: string;
    PASS: string;
  }
}

export const config: Config = {
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
  XMLRPC: {
    HOST: process.env.XMLRPC_HOST || "",
    PORT: process.env.XMLRPC_PORT ? parseInt(process.env.XMLRPC_PORT, 10) : 5000,
    USER: process.env.XMLRPC_USER || "",
    PASS: process.env.XMLRPC_PASS || "",
  }
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
