import { getClient } from "@/lib/dbclient";
import { encryptHetznerToken } from "@/lib/hetzner";
import { HetznerServers } from "@/lib/prisma/generated";
import "server-only";

export async function getDBHetznerServer(
  hetznerId: number,
): Promise<HetznerServers | null> {
  const db = getClient();

  return await db.hetznerServers.findUnique({
    where: { hetznerId },
  });
}

export async function createDBHetznerServer(hetznerServer: {
  hetznerId: number;
  publicKey: string;
  privateKey: string;
}): Promise<HetznerServers> {
  const db = getClient();

  return await db.hetznerServers.create({
    data: {
      ...hetznerServer,
      privateKey: Buffer.from(encryptHetznerToken(hetznerServer.privateKey), "base64"),
    },
  });
}

export async function deleteDBHetznerServer(hetznerId: number): Promise<void> {
  const db = getClient();

  await db.hetznerServers.deleteMany({
    where: { hetznerId },
  });
}
