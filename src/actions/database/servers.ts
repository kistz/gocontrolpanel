"use server";

import { doServerActionWithAuth } from "@/lib/actions";
import { getClient } from "@/lib/dbclient";
import { getGbxClientManager } from "@/lib/gbxclient";
import { Servers } from "@/lib/prisma/generated";
import { PaginationResponse, ServerResponse } from "@/types/responses";
import { PaginationState } from "@tanstack/react-table";

export async function getServers(): Promise<ServerResponse<Servers[]>> {
  return doServerActionWithAuth(["admin"], async () => {
    const db = getClient();
    return await db.servers.findMany({
      where: {
        deletedAt: null,
      },
    });
  });
}

export async function getServersPaginated(
  pagination: PaginationState,
  sorting: { field: string; order: "asc" | "desc" },
  filter?: string,
): Promise<ServerResponse<PaginationResponse<Servers>>> {
  return doServerActionWithAuth(["admin"], async () => {
    const db = getClient();
    const servers = await db.servers.findMany({
      skip: pagination.pageIndex * pagination.pageSize,
      take: pagination.pageSize,
      orderBy: { [sorting.field]: sorting.order },
      where: {
        deletedAt: null,
        ...(filter ? { name: { contains: filter } } : {}),
      },
    });

    const totalCount = await db.servers.count({
      where: {
        deletedAt: null,
        ...(filter ? { name: { contains: filter } } : {}),
      },
    });

    return {
      data: servers,
      totalCount,
    };
  });
}

export async function createServer(
  server: Omit<
    Servers,
    | "id"
    | "manualRouting"
    | "messageFormat"
    | "connectMessage"
    | "disconnectMessage"
    | "createdAt"
    | "updatedAt"
    | "deletedAt"
  >,
): Promise<ServerResponse<Servers>> {
  return doServerActionWithAuth(["admin"], async () => {
    const db = getClient();
    const newServer = await db.servers.create({
      data: server,
    });
    return newServer;
  });
}

export async function updateServer(
  serverId: string,
  server: Partial<
    Omit<
      Servers,
      | "id"
      | "manualRouting"
      | "messageFormat"
      | "connectMessage"
      | "disconnectMessage"
      | "createdAt"
      | "updatedAt"
    >
  >,
): Promise<ServerResponse<Servers>> {
  return doServerActionWithAuth(["admin"], async () => {
    const db = getClient();
    const updatedServer = await db.servers.update({
      where: { id: serverId },
      data: server,
    });
    return updatedServer;
  });
}

export async function getServerChatConfig(
  serverId: string,
): Promise<
  ServerResponse<
    Pick<
      Servers,
      "manualRouting" | "messageFormat" | "connectMessage" | "disconnectMessage"
    >
  >
> {
  return doServerActionWithAuth(["admin"], async () => {
    const db = getClient();
    const server = await db.servers.findUnique({
      where: { id: serverId },
      select: {
        manualRouting: true,
        messageFormat: true,
        connectMessage: true,
        disconnectMessage: true,
      },
    });
    if (!server) {
      throw new Error("Server not found");
    }
    return server;
  });
}

export async function updateServerChatConfig(
  serverId: string,
  chatConfig: Pick<
    Servers,
    "manualRouting" | "messageFormat" | "connectMessage" | "disconnectMessage"
  >,
): Promise<ServerResponse<Servers>> {
  return doServerActionWithAuth(["admin"], async () => {
    const manager = await getGbxClientManager(serverId);
    const canManualRoute = await manager.client.call(
      "ChatEnableManualRouting",
      chatConfig.manualRouting,
    );
    if (!canManualRoute) {
      chatConfig.manualRouting = false;
    }

    const db = getClient();
    const updatedServer = await db.servers.update({
      where: { id: serverId },
      data: { ...chatConfig },
    });

    manager.info.chat = chatConfig;

    if (!canManualRoute) {
      throw new Error("Failed to update manual routing setting.");
    }

    return updatedServer;
  });
}

export async function deleteServer(serverId: string): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const db = getClient();
    await db.servers.update({
      where: { id: serverId },
      data: { deletedAt: new Date() },
    });
  });
}
