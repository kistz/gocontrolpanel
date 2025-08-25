import { getAllServers, syncAllMaps } from "./actions/database/gbx";
import {
  authenticate,
  authenticateCredentials,
  getCredentialsToken,
  getTokens,
} from "./lib/api/nadeo";
import { getGbxClient } from "./lib/gbxclient";

export async function register() {
  const tokens = await getTokens();
  if (!tokens) {
    await authenticate();
  }
  const credentialsToken = await getCredentialsToken();
  if (!credentialsToken) {
    await authenticateCredentials();
  }
  syncAllMaps();
  const servers = await getAllServers();
  for (const server of servers) {
    await getGbxClient(server.id);
  }
}
