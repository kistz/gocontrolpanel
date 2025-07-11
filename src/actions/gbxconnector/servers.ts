"use server";
import { AddServerSchemaType } from "@/forms/admin/server/add-server-schema";
import { EditServerSchemaType } from "@/forms/admin/server/edit-server-schema";
import { doServerActionWithAuth } from "@/lib/actions";
import { axiosAuth } from "@/lib/axios/connector";
import { connectToGbxClient } from "@/lib/gbxclient";
import { getRedisClient } from "@/lib/redis";
import { ServerError, ServerResponse } from "@/types/responses";
import { Server } from "@/types/server";
import { isAxiosError } from "axios";
import { removeServerUuidFromGroups } from "../database/groups";

let healthStatus: boolean | null = null;

// Sync the servers
export async function syncServers(): Promise<Server[]> {
  try {
    const res = await axiosAuth.get<Server[]>("/servers");

    if (res.status !== 200) {
      if (isAxiosError(res) && res.code === "ECONNREFUSED") {
        healthStatus = false;
      }
      throw new ServerError("Failed to get servers");
    }

    const redis = await getRedisClient();

    const servers = res.data;

    await redis.set("servers", JSON.stringify(servers), "EX", 60 * 60); // Cache for 1 hour
    return servers;
  } catch (error) {
    if (isAxiosError(error) && error.code === "ECONNREFUSED") {
      healthStatus = false;
    }
    console.error("Error syncing servers:", error);
    throw new ServerError("Failed to sync servers");
  }
}

export async function getServers(): Promise<ServerResponse<Server[]>> {
  return doServerActionWithAuth(["admin"], async () => {
    return await syncServers();
  });
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
  return doServerActionWithAuth(["admin"], async () => {
    const res = await axiosAuth.post("/servers", server);

    if (res.status !== 200) {
      throw new ServerError("Failed to add server");
    }

    await syncServers();
  });
}

export async function editServer(
  serverUuid: string,
  server: EditServerSchemaType,
): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const res = await axiosAuth.put(`/servers/${serverUuid}`, server);

    if (res.status !== 200) {
      throw new ServerError("Failed to edit server");
    }

    await syncServers();
  });
}

export async function removeServer(
  serverUuid: string,
): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const res = await axiosAuth.delete(`/servers/${serverUuid}`);

    if (res.status !== 200) {
      throw new ServerError("Failed to remove server");
    }

    await removeServerUuidFromGroups(serverUuid);
    await syncServers();
  });
}

export async function orderServers(
  servers: Server[],
): Promise<ServerResponse<Server[]>> {
  return doServerActionWithAuth(["admin"], async () => {
    const res = await axiosAuth.put(
      "/servers/order",
      servers.map((server) => server.uuid),
    );

    if (res.status !== 200) {
      throw new ServerError("Failed to order servers");
    }

    const orderedServers: Server[] = res.data;

    for (const server of orderedServers) {
      try {
        await connectToGbxClient(server.uuid);
      } catch (error) {
        console.error("Failed to connect to server", error);
      }
    }

    return orderedServers;
  });
}
