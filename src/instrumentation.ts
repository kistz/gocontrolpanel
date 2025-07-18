import { syncAllMaps } from "./actions/database/gbx";
import { authenticate, getTokens } from "./lib/api/nadeo";

export async function register() {
  const tokens = await getTokens();
  if (!tokens) {
    await authenticate();
  }
  syncAllMaps();
}
