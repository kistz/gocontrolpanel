"use server";

import { doServerActionWithAuth } from "@/lib/actions";
import { getClient } from "@/lib/dbclient";
import { Interfaces } from "@/lib/prisma/generated";
import { ServerError, ServerResponse } from "@/types/responses";

export async function getInterfaces(
  serverUuid: string,
): Promise<ServerResponse<Interfaces[]>> {
  return doServerActionWithAuth(["admin"], async () => {
    const db = getClient();
    const interfaces = await db.interfaces.findMany({
      where: {
        serverUuid,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return interfaces;
  });
}

export async function createInterface(
  serverUuid: string,
  name: string,
  interfaceString: string,
): Promise<ServerResponse<Interfaces>> {
  return doServerActionWithAuth(["admin"], async () => {
    const db = getClient();
    const result = await db.interfaces.create({
      data: {
        serverUuid,
        name,
        interfaceString,
      },
    });

    if (!result) {
      throw new ServerError("Failed to save interface");
    }

    return result;
  });
}

export async function saveInterface(
  serverUuid: string,
  interfaceId: string,
  interfaceString: string,
): Promise<ServerResponse<Interfaces>> {
  return doServerActionWithAuth(["admin"], async () => {
    const db = getClient();
    const result = await db.interfaces.update({
      where: {
        id: interfaceId,
        serverUuid,
      },
      data: {
        interfaceString,
      },
    });

    if (!result) {
      throw new ServerError("Failed to save interface");
    }

    return result;
  });
}
