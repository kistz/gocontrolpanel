"use server";

import { AddServerSchemaType } from "@/forms/admin/add-server-schema";
import { doServerAction } from "@/lib/actions";
import config from "@/lib/config";
import redis from "@/lib/redis";
import { ServerError, ServerResponse } from "@/types/responses";
import { Server } from "@/types/server";
import { setupJukeboxCallbacks } from "../gbx/map";
import { EditServerSchemaType } from "@/forms/admin/edit-server-schema";

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

export async function addServer(
  server: AddServerSchemaType,
): Promise<ServerResponse> {
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

export async function editServer(serverId: number, server: EditServerSchemaType): Promise<ServerResponse> {
  return doServerAction(async () => {
    const res = await fetch(`${config.CONNECTOR_URL}/servers/${serverId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(server),
    });

    if (!res.ok) {
      throw new ServerError("Failed to edit server");
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
