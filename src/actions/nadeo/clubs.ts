"use server";

import { doServerActionWithAuth } from "@/lib/actions";
import {
  getClubCampaign,
  getClubCampaigns as getClubCampaignsAPI,
} from "@/lib/api/nadeo";
import {
  ClubCampaignsResponse,
  ClubCampaignWithPlaylistMaps,
} from "@/types/api/nadeo";
import { ServerResponse } from "@/types/responses";
import { getMapsByUids } from "../database/maps";

export async function getClubCampaigns(
  filter?: string,
  offset?: number,
): Promise<ServerResponse<ClubCampaignsResponse>> {
  return doServerActionWithAuth(
    ["servers::moderator", "servers::admin"],
    async () => {
      return await getClubCampaignsAPI(offset, filter);
    },
  );
}

export async function getClubCampaignWithMaps(
  clubId: number,
  campaignId: number,
): Promise<ServerResponse<ClubCampaignWithPlaylistMaps>> {
  return doServerActionWithAuth(
    ["servers::moderator", "servers::admin"],
    async () => {
      const campaign = await getClubCampaign(clubId, campaignId);

      const mapUids = campaign.campaign.playlist.map((m) => m.mapUid);
      const { data: maps, error } = await getMapsByUids(mapUids);
      if (error) {
        throw new Error(error);
      }

      return {
        ...campaign,
        campaign: {
          ...campaign.campaign,
          playlist: campaign.campaign.playlist
            .map((p) => ({
              ...p,
              map: maps.find((m) => m.uid === p.mapUid),
            }))
            .filter((p) => p.map !== undefined),
        },
      } as ClubCampaignWithPlaylistMaps;
    },
  );
}
