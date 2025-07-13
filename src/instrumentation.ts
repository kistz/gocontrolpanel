import { getAllMaps } from "./actions/database/maps";
import { syncServers } from "./actions/gbxconnector/servers";
import { authenticate, getTokens } from "./lib/api/nadeo";
import { connectToGbxClient } from "./lib/gbxclient";

export async function register() {
  const tokens = await getTokens();
  if (!tokens) {
    await authenticate();
  }
  getAllMaps();
}
