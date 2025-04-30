"use server";
import { setupJukeboxCallbacks } from "@/actions/gbx/map";
import config from "@/lib/config";
import { GbxClient } from "@evotm/gbxclient";
import { Server } from "../types/server";
import redis from "./redis";

let cachedClients: {
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

  const client = new GbxClient();
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

// Sync the servers
export async function syncServers() {
  const res = await fetch(`${config.CONNECTOR_URL}/servers`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch servers from connector");
  }

  const servers: Server[] = await res.json();

  await redis.set("servers", JSON.stringify(servers));
}

export async function getServers(): Promise<Server[]> {
  const raw = await redis.get("servers");
  if (!raw) throw new Error("Failed to get servers from cache");
  const servers: Server[] = JSON.parse(raw);
  return servers;
}

export async function setupCallbacks(): Promise<void> {
  await syncServers();
  await setupJukeboxCallbacks();
}
