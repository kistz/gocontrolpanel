"use server";

import { doServerActionWithAuth } from "@/lib/actions";
import { getSeasonalCampaigns } from "@/lib/api/nadeo";
import { getKeySeasonalCampaigns, getRedisClient } from "@/lib/redis";
import { Campaign } from "@/types/api/nadeo";
import { ServerResponse } from "@/types/responses";

export async function getAllSeasonalCampaigns(): Promise<
  ServerResponse<Campaign[]>
> {
  return doServerActionWithAuth(
    ["servers::moderator", "servers::admin"],
    async () => {
      const redis = await getRedisClient();
      const key = getKeySeasonalCampaigns();

      const cached = await redis.get(key);
      if (cached) {
        return JSON.parse(cached);
      }

      const seasonalCampaignListResponse = await getSeasonalCampaigns(100);

      await redis.set(
        key,
        JSON.stringify(seasonalCampaignListResponse.campaignList),
        "EX",
        seasonalCampaignListResponse.relativeNextRequest,
      );

      return seasonalCampaignListResponse.campaignList;
    },
  );
}
