import { getAllMaps } from "./actions/database/map";
import { authenticate, getTokens } from "./lib/api/nadeo";
import { setupCallbacks } from "./lib/gbxclient";

export async function register() {
  setupCallbacks();
  const tokens = await getTokens();
  if (!tokens) {
    await authenticate();
  }
  getAllMaps();
}
