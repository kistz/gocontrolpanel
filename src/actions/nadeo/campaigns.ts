"use server";

import { doServerActionWithAuth } from "@/lib/actions";
import { getSeasonalCampaigns } from "@/lib/api/nadeo";
import {
  getKeyCampaign,
  getKeySeasonalCampaigns,
  getRedisClient,
} from "@/lib/redis";
import { Campaign, CampaignWithPlaylistMaps } from "@/types/api/nadeo";
import { ServerResponse } from "@/types/responses";
import { getMapsByUids } from "../database/maps";

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

export async function getCampaignWithMaps(
  campaign: Campaign,
): Promise<ServerResponse<CampaignWithPlaylistMaps>> {
  return doServerActionWithAuth(
    ["servers::moderator", "servers::admin"],
    async () => {
      const redis = await getRedisClient();
      const key = getKeyCampaign(campaign.id);

      const cached = await redis.get(key);
      if (cached) {
        return JSON.parse(cached);
      }

      if (campaign.playlist.length === 0)
        return campaign as CampaignWithPlaylistMaps;

      const mapUids = campaign.playlist.map((p) => p.mapUid);
      const { data: maps, error } = await getMapsByUids(mapUids);
      if (error) {
        throw new Error(error);
      }

      const response = {
        ...campaign,
        playlist: campaign.playlist
          .map((p) => ({
            ...p,
            map: maps?.find((m) => m.uid === p.mapUid),
          }))
          .filter((p) => p.map !== undefined),
      } as CampaignWithPlaylistMaps;

      await redis.set(
        key,
        JSON.stringify(response),
        "EX",
        15 * 60, // Cache for 15 minutes
      );

      return response;
    },
  );
}
