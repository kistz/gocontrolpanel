import { axiosHetzner } from "@/lib/axios/hetzner";
import { getHetznerProject } from "@/lib/hetzner";
import { getKeyHetznerRateLimit, getRedisClient } from "@/lib/redis";
import { getList } from "@/lib/utils";
import {
  HetznerServer,
  HetznerServersResponse,
} from "@/types/api/hetzner/servers";
import { AxiosResponse } from "axios";
import "server-only";

export async function getApiToken(projectId: string): Promise<string> {
  const project = await getHetznerProject(projectId);
  const apiTokens = getList<string>(project?.apiTokens);

  if (apiTokens.length === 0) {
    throw new Error("No API tokens found for the Hetzner project.");
  }

  return apiTokens[0];
}

export async function setRateLimit(projectId: string, res: AxiosResponse) {
  const redis = await getRedisClient();
  const rateLimit = res.headers["ratelimit-limit"];
  const rateLimitRemaining = res.headers["ratelimit-remaining"];

  if (rateLimit && rateLimitRemaining) {
    await redis.set(
      getKeyHetznerRateLimit(projectId),
      JSON.stringify({
        limit: rateLimit,
        remaining: rateLimitRemaining,
      }),
    );
  }
}

export async function getHetznerServers(
  projectId: string,
): Promise<HetznerServersResponse> {
  const token = await getApiToken(projectId);

  const res = await axiosHetzner.get<HetznerServersResponse>("/servers", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  await setRateLimit(projectId, res);

  return res.data;
}

export async function getHetznerServer(
  projectId: string,
  serverId: number,
): Promise<HetznerServer> {
  const token = await getApiToken(projectId);

  const res = await axiosHetzner.get<{
    server: HetznerServer;
  }>(`/servers/${serverId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  await setRateLimit(projectId, res);

  return res.data.server;
}
