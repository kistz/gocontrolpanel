import { getClient } from "@/lib/dbclient";
import { encryptHetznerToken } from "@/lib/hetzner";
import { HetznerServers } from "@/lib/prisma/generated";
import "server-only";

export async function createDBHetznerServer(hetznerServer: {
  hetznerId: number;
  publicKey: string;
  privateKey: string;
}): Promise<HetznerServers> {
  const db = getClient();

  return await db.hetznerServers.create({
    data: {
      ...hetznerServer,
      privateKey: Buffer.from(encryptHetznerToken(hetznerServer.privateKey)),
    },
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
