import { getKeyHetznerRateLimit, getRedisClient } from "@/lib/redis";
import { getList } from "@/lib/utils";
import { AxiosResponse } from "axios";
import "server-only";
import { getHetznerProject } from "../database/hetzner-projects";

export async function getApiToken(projectId: string): Promise<string> {
  const { data: project } = await getHetznerProject(projectId);
  const apiTokens = getList(project?.apiTokens);

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
