"use server";

import { doServerActionWithAuth } from "@/lib/actions";
import { getClubCampaign, getClubCampaigns, getClubs } from "@/lib/api/nadeo";
import { getKeyClubCampaigns, getKeyClubs, getRedisClient } from "@/lib/redis";
import { Club, ClubCampaign, ClubCampaignWithPlaylistMaps } from "@/types/api/nadeo";
import { PaginationResponse, ServerResponse } from "@/types/responses";
import { PaginationState } from "@tanstack/react-table";
import { getMapsByUids } from "../database/maps";

export async function getClubCampaignsPaginated(
  pagination: PaginationState,
  _: { field: string; order: "asc" | "desc" },
  filter?: string,
): Promise<ServerResponse<PaginationResponse<ClubCampaign>>> {
  return doServerActionWithAuth(
    ["servers::moderator", "servers::admin"],
    async () => {
      const redis = await getRedisClient();
      const key = getKeyClubCampaigns(pagination, filter);

      const cached = await redis.get(key);
      if (cached) {
        return JSON.parse(cached);
      }

      const response = await getClubCampaigns(
        pagination.pageIndex * pagination.pageSize,
        filter,
        pagination.pageSize,
      );

      const paginatedResponse = {
        totalCount: response.itemCount,
        data: response.clubCampaignList,
      };

      await redis.set(key, JSON.stringify(paginatedResponse), "EX", 300);

      return paginatedResponse;
    },
  );
}

export async function getClubsPaginated(
  pagination: PaginationState,
  _: { field: string; order: "asc" | "desc" },
  filter?: string,
): Promise<ServerResponse<PaginationResponse<Club>>> {
  return doServerActionWithAuth(
    ["servers::moderator", "servers::admin"],
    async () => {
      const redis = await getRedisClient();
      const key = getKeyClubs(pagination, filter);

      const cached = await redis.get(key);
      if (cached) {
        return JSON.parse(cached);
      }

      const response = await getClubs(
        pagination.pageIndex * pagination.pageSize,
        filter,
        pagination.pageSize,
      );

      const paginatedResponse = {
        totalCount: response.clubCount,
        data: response.clubList,
      };

      await redis.set(key, JSON.stringify(paginatedResponse), "EX", 300);

      return paginatedResponse;
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
