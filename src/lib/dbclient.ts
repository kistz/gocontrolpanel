import "server-only";
import { appGlobals } from "./global";
import { PrismaClient } from "./prisma/generated";

export function getClient(): PrismaClient {
  if (!appGlobals.prisma) {
    try {
      appGlobals.prisma = new PrismaClient();
      console.log("Prisma client initialized");
      return appGlobals.prisma;
    } catch (error) {
      if (process.env.NODE_ENV === "production") {
        console.warn("Prisma not available during build, continuing...");
      } else {
        console.error("Error connecting to Prisma:", error);
        throw new Error("Failed to connect to Prisma");
      }
    }
  }

  if (!appGlobals.prisma) {
    throw new Error("Prisma client is not initialized");
  }

  return appGlobals.prisma;
}
