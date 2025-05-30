import { getAllMaps } from "./actions/database/map";
import { syncServers } from "./actions/gbxconnector/servers";
import { authenticate, getTokens } from "./lib/api/nadeo";

export async function register() {
  syncServers();
  const tokens = await getTokens();
  if (!tokens) {
    await authenticate();
  }
  getAllMaps();
}
