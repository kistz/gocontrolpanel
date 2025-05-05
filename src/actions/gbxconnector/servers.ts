"use server";
import { AddServerSchemaType } from "@/forms/admin/add-server-schema";
import { EditServerSchemaType } from "@/forms/admin/edit-server-schema";
import { doServerAction } from "@/lib/actions";
import config from "@/lib/config";
import { closeGbxClient } from "@/lib/gbxclient";
import { axiosAuth } from "@/lib/interceptor";
import { getRedisClient } from "@/lib/redis";
import { ServerError, ServerResponse } from "@/types/responses";
import { Server } from "@/types/server";
import { isAxiosError } from "axios";
import { setupJukeboxCallbacks } from "../gbx/map";

let healthStatus: boolean | null = null;

// Sync the servers
export async function syncServers(): Promise<Server[]> {
  const res = await axiosAuth.get("/servers");

  if (res.status !== 200) {
    if (isAxiosError(res) && res.code === "ECONNREFUSED") {
      healthStatus = false;
    }
    throw new ServerError("Failed to get servers");
  }

  const redis = await getRedisClient();

  const servers: Server[] = res.data;

  await redis.set("servers", JSON.stringify(servers), "EX", 60 * 60); // Cache for 1 hour
  return servers;
}

export async function getServers(): Promise<Server[]> {
  return await syncServers();
}

export async function getHealthStatus(): Promise<boolean> {
  try {
    const res = await axiosAuth.get("/health", {
      timeout: 3000,
    });

    if (res.status !== 200) {
      healthStatus = false;
      return healthStatus;
    }

    healthStatus = true;
    return healthStatus;
  } catch {
    healthStatus = false;
    return healthStatus;
  }
}

export async function addServer(
  server: AddServerSchemaType,
): Promise<ServerResponse> {
  return doServerAction(async () => {
    const res = await axiosAuth.post(`${config.CONNECTOR_URL}/servers`, server);

    if (res.status !== 200) {
      throw new ServerError("Failed to add server");
    }

    await syncServers();
  });
}

export async function editServer(
  serverId: number,
  server: EditServerSchemaType,
): Promise<ServerResponse> {
  return doServerAction(async () => {
    const res = await axiosAuth.put(`/servers/${serverId}`, server);

    if (res.status !== 200) {
      throw new ServerError("Failed to edit server");
    }

    await syncServers();
  });
}

export async function removeServer(id: number): Promise<ServerResponse> {
  return doServerAction(async () => {
    const res = await axiosAuth.delete(`/servers/${id}`);

    if (res.status !== 200) {
      throw new ServerError("Failed to remove server");
    }

    await syncServers();
  });
}

export async function orderServers(
  servers: Server[],
): Promise<ServerResponse<Server[]>> {
  return doServerAction(async () => {
    const res = await axiosAuth.put(
      "/servers/order",
      servers.map((server) => server.id),
    );

    if (res.status !== 200) {
      throw new ServerError("Failed to order servers");
    }

    for (const server of servers) {
      await closeGbxClient(server.id);
    }

    return await syncServers();
  });
}

export async function setupCallbacks(): Promise<void> {
  await syncServers();
  await setupJukeboxCallbacks();
}
