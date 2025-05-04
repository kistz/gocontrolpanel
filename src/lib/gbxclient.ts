"use server";
import { getServers } from "@/actions/gbxconnector/servers";
import { GbxClient } from "@evotm/gbxclient";

const cachedClients: {
  [key: number]: GbxClient;
} = {};

export async function connectToGbxClient(id: number) {
  if (cachedClients[id]) {
    return cachedClients[id];
  }

  const servers = await getServers();
  const server = servers.find((server) => server.id == id);
  if (!server) {
    throw new Error(`Server ${id} not found in cached servers`);
  }

  const client = new GbxClient({
    showErrors: true,
    throwErrors: true,
  });
  try {
    const status = await client.connect(server.host, server.xmlrpcPort);
    if (!status) {
      throw new Error("Failed to connect to GBX client");
    }
  } catch (error) {
    throw new Error(`Failed to connect to GBX client: ${error}`);
  }

  try {
    await client.call("Authenticate", server.user, server.pass);
  } catch {
    throw new Error("Failed to authenticate with GBX client");
  }

  await client.call("SetApiVersion", "2023-04-24");
  await client.call("EnableCallbacks", true);
  await client.callScript("XmlRpc.EnableCallbacks", "true");

  cachedClients[server.id] = client;
  return client;
}

export async function getGbxClient(id: number) {
  const client = await connectToGbxClient(id);
  return client;
}
