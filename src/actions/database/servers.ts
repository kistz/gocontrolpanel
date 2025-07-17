"use server";

import { doServerActionWithAuth } from "@/lib/actions";
import { getClient } from "@/lib/dbclient";
import { Servers } from "@/lib/prisma/generated";
import { PaginationResponse, ServerResponse } from "@/types/responses";
import { PaginationState } from "@tanstack/react-table";

export async function getServers(): Promise<ServerResponse<Servers[]>> {
  return doServerActionWithAuth(["admin"], async () => {
    const db = getClient();
    return await db.servers.findMany({
      where: {
        deletedAt: null,
      }
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
      }
    });

    return {
      data: servers,
      totalCount,
    };
  });
}

export async function createServer(
  server: Omit<Servers, "id" | "createdAt" | "updatedAt" | "deletedAt">,
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
  server: Partial<Omit<Servers, "id" | "createdAt" | "updatedAt">>,
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

export async function deleteServer(serverId: string): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const db = getClient();
    await db.servers.update({
      where: { id: serverId },
      data: { deletedAt: new Date() },
    });
  });
}
