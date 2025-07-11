import { axiosHetzner } from "@/lib/axios/hetzner";
import { getKeyHetznerServerTypes, getRedisClient } from "@/lib/redis";
import {
  HetznerServerType,
  HetznerServerTypesResponse,
} from "@/types/api/hetzner/servers";
import "server-only";

export async function getServerTypes(
  apiToken: string,
): Promise<HetznerServerType[]> {
  const redis = await getRedisClient();
  const key = getKeyHetznerServerTypes();

  const cachedData = await redis.get(key);
  if (cachedData) {
    return JSON.parse(cachedData) as HetznerServerType[];
  }

  const res = await axiosHetzner.get<HetznerServerTypesResponse>(
    "/server_types",
    {
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
    },
  );

  const serverTypes = res.data.server_types;
  await redis.set(key, JSON.stringify(serverTypes), "EX", 60 * 60 * 24); // Cache for 24 hours

  return serverTypes;
}
