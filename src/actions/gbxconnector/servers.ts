"use server";

import { ServerError, ServerResponse } from "@/types/responses";
import { setupJukeboxCallbacks } from "../gbx/map";
import { doServerAction } from "@/lib/actions";
import config from "@/lib/config";
import { AddServer, Server } from "@/types/server";
import redis from "@/lib/redis";


// Sync the servers
export async function syncServers(): Promise<Server[]> {
  const res = await fetch(`${config.CONNECTOR_URL}/servers`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new ServerError("Failed to get servers");
  }

  const servers: Server[] = await res.json();

  await redis.set("servers", JSON.stringify(servers), "EX", 60 * 60); // Cache for 1 hour
  return servers;
}

export async function getServers(): Promise<Server[]> {
  return await syncServers();
}

export async function addServer(server: AddServer): Promise<ServerResponse> {
  return doServerAction(async () => {
    const res = await fetch(`${config.CONNECTOR_URL}/servers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(server),
    });

    if (!res.ok) {
      throw new ServerError("Failed to add server");
    }

    await syncServers();
  });
}

export async function removeServer(id: number): Promise<ServerResponse> {
  return doServerAction(async () => {
    const res = await fetch(`${config.CONNECTOR_URL}/servers/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new ServerError("Failed to remove server");
    }

    await syncServers();
  });
}

export async function setupCallbacks(): Promise<void> {
  await syncServers();
  await setupJukeboxCallbacks();
}
