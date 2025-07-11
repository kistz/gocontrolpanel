// lib/global-state.ts

import { GbxClient } from "@evotm/gbxclient";
import { PrismaClient } from "./prisma/generated";

type GlobalState = {
  prisma?: PrismaClient;
  gbxClients?: Record<string, GbxClient>;
};

const globalState = globalThis as unknown as { __appGlobals__?: GlobalState };

if (!globalState.__appGlobals__) {
  globalState.__appGlobals__ = {
    gbxClients: {},
  };
}

export const appGlobals = globalState.__appGlobals__!;
