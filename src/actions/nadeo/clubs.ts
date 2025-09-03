"use server";

import { doServerActionWithAuth } from "@/lib/actions";
import {
  getAccountNames,
  getClubActivities,
  getClubById,
  getClubCampaign,
  getClubCampaigns,
  getClubRoom,
  getClubs,
} from "@/lib/api/nadeo";
import {
  getKeyClubActivities,
  getKeyClubActivitiesPaginated,
  getKeyClubCampaign,
  getKeyClubCampaignsPaginated,
  getKeyClubsPaginated,
  getRedisClient,
} from "@/lib/redis";
import {
  Club,
  ClubActivitiesResponse,
  ClubActivity,
  ClubCampaign,
  ClubCampaignWithPlaylistMaps,
  ClubRoomWithNamesAndMaps,
  ClubWithAccountNames,
} from "@/types/api/nadeo";
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
      const key = getKeyClubCampaignsPaginated(pagination, filter);

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
      const key = getKeyClubsPaginated(pagination, filter);

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

export async function getClubActivitiesPaginated(
  pagination: PaginationState,
  _: { field: string; order: "asc" | "desc" },
  __?: string,
  fetchArgs?: number,
): Promise<ServerResponse<PaginationResponse<ClubActivity>>> {
  return doServerActionWithAuth(
    ["servers::moderator", "servers::admin"],
    async () => {
      if (!fetchArgs) {
        throw new Error("No club id provided");
      }

      const redis = await getRedisClient();
      const key = getKeyClubActivitiesPaginated(fetchArgs, pagination);

      const cached = await redis.get(key);
      if (cached) {
        return JSON.parse(cached);
      }

      const response = await getClubActivities(
        fetchArgs,
        pagination.pageIndex * pagination.pageSize,
      );

      const paginatedResponse = {
        totalCount: response.itemCount,
        data: response.activityList,
      };

      await redis.set(key, JSON.stringify(paginatedResponse), "EX", 300);

      return paginatedResponse;
    },
  );
}

export async function getClubActivitiesList(
  clubId: number,
  offset = 0,
  length = 12,
): Promise<ServerResponse<ClubActivitiesResponse>> {
  return doServerActionWithAuth(["clubs:view"], async () => {
    const redis = await getRedisClient();
    const key = getKeyClubActivities(clubId, offset);

    const cached = await redis.get(key);
    if (cached) {
      return JSON.parse(cached);
    }

    const response = await getClubActivities(clubId, offset, length);

    await redis.set(key, JSON.stringify(response), "EX", 300);

    return response;
  });
}

export async function getClubCampaignWithMaps(
  clubId: number,
  campaignId: number,
): Promise<ServerResponse<ClubCampaignWithPlaylistMaps>> {
  return doServerActionWithAuth(
    ["servers::moderator", "servers::admin"],
    async () => {
      const redis = await getRedisClient();
      const key = getKeyClubCampaign(clubId, campaignId);

      const cached = await redis.get(key);
      if (cached) {
        return JSON.parse(cached);
      }

      const campaign = await getClubCampaign(clubId, campaignId);

      const mapUids = campaign.campaign.playlist.map((m) => m.mapUid);
      const { data: maps, error } = await getMapsByUids(mapUids);
      if (error) {
        throw new Error(error);
      }

      const response = {
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

      await redis.set(key, JSON.stringify(response), "EX", 300);

      return response;
    },
  );
}

export async function getClub(
  clubId: number,
): Promise<ServerResponse<ClubWithAccountNames>> {
  return doServerActionWithAuth(["clubs:view"], async () => {
    const redis = await getRedisClient();
    const key = `club:${clubId}`;

    const cached = await redis.get(key);
    if (cached) {
      return JSON.parse(cached);
    }

    const club = await getClubById(clubId);
    const accountNames = await getAccountNames([
      club.authorAccountId,
      club.latestEditorAccountId,
    ]);

    const clubWithAccountNames = {
      ...club,
      authorName: accountNames[club.authorAccountId] || "Unknown",
      latestEditorName: accountNames[club.latestEditorAccountId] || "Unknown",
    };

    await redis.set(key, JSON.stringify(clubWithAccountNames), "EX", 60);

    return clubWithAccountNames;
  });
}

export async function getClubRoomWithNamesAndMaps(
  clubId: number,
  roomId: number,
): Promise<ServerResponse<ClubRoomWithNamesAndMaps>> {
  return doServerActionWithAuth(["clubs:view"], async () => {
    const clubRoom = await getClubRoom(clubId, roomId);

    const accountNames = await getAccountNames([
      clubRoom.creatorAccountId,
      clubRoom.latestEditorAccountId,
    ]);

    const { data: maps, error } = await getMapsByUids(clubRoom.room.maps);
    if (error) {
      throw new Error(error);
    }

    return {
      ...clubRoom,
      room: {
        ...clubRoom.room,
        mapObjects: maps,
      },
      creatorName: accountNames[clubRoom.creatorAccountId] || "Unknown",
      latestEditorName:
        accountNames[clubRoom.latestEditorAccountId] || "Unknown",
    };
  });
}
