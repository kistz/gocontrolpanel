import { PrismaClient } from "./prisma/generated";

let cachedClient: PrismaClient | null = null;

export function getClient(): PrismaClient {
  if (cachedClient) {
    return cachedClient;
  }

  try {
    cachedClient = new PrismaClient();

    return cachedClient;
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      console.warn("Prisma not available during build, continuing...");
    } else {
      console.error("Error connecting to Prisma:", error);
      throw new Error("Failed to connect to Prisma");
    }
  }

  if (!cachedClient) {
    throw new Error("Prisma client is not initialized");
  }

  return cachedClient;
}
