import { getAllMaps } from "./actions/database/map";
import { setupCallbacks } from "./actions/gbxconnector/servers";
import { authenticate, getTokens } from "./lib/api/nadeo";

export async function register() {
  setupCallbacks();
  const tokens = await getTokens();
  if (!tokens) {
    await authenticate();
  }
  getAllMaps();
}
