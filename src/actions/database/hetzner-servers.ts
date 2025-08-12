import { getClient } from "@/lib/dbclient";
import { HetznerServers } from "@/lib/prisma/generated";
import "server-only";

export async function createDBHetznerServer(
  hetznerServer: Omit<
    HetznerServers,
    "id" | "createdAt" | "updatedAt" | "deletedAt"
  >,
): Promise<HetznerServers> {
  const db = getClient();

  return await db.hetznerServers.create({
    data: hetznerServer,
  });
}

export async function deleteDBHetznerServer(
  hetznerId: number,
): Promise<HetznerServers> {
  const db = getClient();

  return await db.hetznerServers.delete({
    where: { hetznerId },
  });
}
