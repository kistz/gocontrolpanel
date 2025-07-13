import "server-only";

import { GbxClient } from "@evotm/gbxclient";
import { PrismaClient } from "./prisma/generated";
import Redis from "ioredis";
import { FileManager } from "@/types/filemanager";
import { GbxClientManager } from "./gbxclient";

type GlobalState = {
  prisma?: PrismaClient;
  redis?: Redis;
  gbxClients?: Record<string, GbxClientManager>;
  fileManagers?: Record<string, FileManager>;
};

const globalState = globalThis as unknown as { __appGlobals__?: GlobalState };

if (!globalState.__appGlobals__) {
  globalState.__appGlobals__ = {
    gbxClients: {},
    fileManagers: {},
  };
}

export const appGlobals = globalState.__appGlobals__!;
