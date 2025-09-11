"use server";

import { doServerActionWithAuth } from "@/lib/actions";
import { getClient } from "@/lib/dbclient";
import { Interfaces } from "@/lib/prisma/generated";
import { ServerError, ServerResponse } from "@/types/responses";
import { logAudit } from "./server-only/audit-logs";

export async function getInterfaces(
  serverId: string,
): Promise<ServerResponse<Interfaces[]>> {
  return doServerActionWithAuth(
    [`servers:${serverId}:admin`, `group:servers:${serverId}:admin`],
    async () => {
      const db = getClient();
      const interfaces = await db.interfaces.findMany({
        where: {
          serverId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return interfaces;
    },
  );
}

export async function createInterface(
  serverId: string,
  name: string,
  interfaceString: string,
): Promise<ServerResponse<Interfaces>> {
  return doServerActionWithAuth(
    [`servers:${serverId}:admin`, `group:servers:${serverId}:admin`],
    async (session) => {
      const db = getClient();
      const result = await db.interfaces.create({
        data: {
          serverId,
          name,
          interfaceString,
        },
      });

      await logAudit(
        session.user.id,
        serverId,
        "server.interface.create",
        { name, interfaceString },
        !result ? "Failed to create interface" : undefined,
      );

      if (!result) {
        throw new ServerError("Failed to create interface");
      }

      return result;
    },
  );
}

export async function saveInterface(
  serverId: string,
  interfaceId: string,
  interfaceString: string,
): Promise<ServerResponse<Interfaces>> {
  return doServerActionWithAuth(
    [`servers:${serverId}:admin`, `group:servers:${serverId}:admin`],
    async (session) => {
      const db = getClient();
      const result = await db.interfaces.update({
        where: {
          id: interfaceId,
          serverId,
        },
        data: {
          interfaceString,
        },
      });

      await logAudit(
        session.user.id,
        serverId,
        "server.interface.edit",
        { interfaceId, interfaceString },
        !result ? "Failed to save interface" : undefined,
      );

      if (!result) {
        throw new ServerError("Failed to save interface");
      }

      return result;
    },
  );
}
