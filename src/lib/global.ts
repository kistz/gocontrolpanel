import "server-only";

import { GbxClient } from "@evotm/gbxclient";
import { PrismaClient } from "./prisma/generated";
import Redis from "ioredis";

type GlobalState = {
  prisma?: PrismaClient;
  redis?: Redis;
  gbxClients?: Record<string, GbxClient>;
};

const globalState = globalThis as unknown as { __appGlobals__?: GlobalState };

if (!globalState.__appGlobals__) {
  globalState.__appGlobals__ = {
    gbxClients: {},
  };
}

export const appGlobals = globalState.__appGlobals__!;
