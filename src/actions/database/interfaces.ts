"use server";

import { doServerActionWithAuth } from "@/lib/actions";
import { getClient } from "@/lib/dbclient";
import { Interfaces } from "@/lib/prisma/generated";
import { ServerError, ServerResponse } from "@/types/responses";

export async function getInterfaces(
  id: string,
): Promise<ServerResponse<Interfaces[]>> {
  return doServerActionWithAuth(["admin"], async () => {
    const db = getClient();
    const interfaces = await db.interfaces.findMany({
      where: {
        id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return interfaces;
  });
}

export async function createInterface(
  id: string,
  name: string,
  interfaceString: string,
): Promise<ServerResponse<Interfaces>> {
  return doServerActionWithAuth(["admin"], async () => {
    const db = getClient();
    const result = await db.interfaces.create({
      data: {
        id,
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
  id: string,
  interfaceId: string,
  interfaceString: string,
): Promise<ServerResponse<Interfaces>> {
  return doServerActionWithAuth(["admin"], async () => {
    const db = getClient();
    const result = await db.interfaces.update({
      where: {
        id: interfaceId,
        id,
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
