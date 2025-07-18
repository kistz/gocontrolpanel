import { getAllMaps } from "./actions/database/maps";
import { authenticate, getTokens } from "./lib/api/nadeo";

export async function register() {
  const tokens = await getTokens();
  if (!tokens) {
    await authenticate();
  }
  getAllMaps();
}
