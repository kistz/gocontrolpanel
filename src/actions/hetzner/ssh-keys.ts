import { axiosHetzner } from "@/lib/axios/hetzner";
import { generateSSHKeyPair } from "@/lib/ssh";
import { HetznerSSHKeyResponse } from "@/types/api/hetzner/ssh-keys";
import "server-only";
import { getApiToken } from "./util";

export async function createHetznerSSHKey(
  projectId: string,
  name: string,
): Promise<{
  publicKey: string;
  privateKey: string;
}> {
  const token = await getApiToken(projectId);

  const keys = generateSSHKeyPair();

  await axiosHetzner.post<HetznerSSHKeyResponse>(
    "/ssh_keys",
    {
      name,
      public_key: keys.publicKey,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return keys;
}
