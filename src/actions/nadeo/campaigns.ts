"use server";

import { doServerActionWithAuth } from "@/lib/actions";
import { downloadFile, getSeasonalCampaigns } from "@/lib/api/nadeo";
import { getFileManager } from "@/lib/filemanager";
import {
  getKeyCampaign,
  getKeySeasonalCampaigns,
  getRedisClient,
} from "@/lib/redis";
import {
  Campaign,
  CampaignWithNamesAndPlaylistMaps,
  ClubCampaignWithNamesAndPlaylistMaps,
} from "@/types/api/nadeo";
import { ServerResponse } from "@/types/responses";
import { getMapsByUids } from "../database/maps";
import { uploadFiles } from "../filemanager";
import { addMapToServer } from "./maps";

export async function getAllSeasonalCampaigns(): Promise<
  ServerResponse<Campaign[]>
> {
  return doServerActionWithAuth(
    [
      "servers::moderator",
      "servers::admin",
      "group:servers::moderator",
      "group:servers::admin",
    ],
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
): Promise<ServerResponse<CampaignWithNamesAndPlaylistMaps>> {
  return doServerActionWithAuth(
    [
      "servers::moderator",
      "servers::admin",
      "group:servers::moderator",
      "group:servers::admin",
    ],
    async () => {
      const redis = await getRedisClient();
      const key = getKeyCampaign(campaign.id);

      const cached = await redis.get(key);
      if (cached) {
        return JSON.parse(cached);
      }

      if (campaign.playlist.length === 0)
        return campaign as CampaignWithNamesAndPlaylistMaps;

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
      } as CampaignWithNamesAndPlaylistMaps;

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

export async function downloadCampaign(
  serverId: string,
  campaign:
    | CampaignWithNamesAndPlaylistMaps
    | ClubCampaignWithNamesAndPlaylistMaps["campaign"],
): Promise<ServerResponse<string[]>> {
  return doServerActionWithAuth(
    [
      `servers:${serverId}:moderator`,
      `servers:${serverId}:admin`,
      `group:servers:${serverId}:moderator`,
      `group:servers:${serverId}:admin`,
    ],
    async () => {
      const fileManager = await getFileManager(serverId);
      if (!fileManager?.health) {
        throw new Error("File manager is not healthy");
      }

      const downloadResults = await Promise.allSettled(
        campaign.playlist.map((p) => {
          if (!p.map?.fileUrl) {
            return Promise.reject(
              new Error(`Map ${p.mapUid} does not have a valid download URL`),
            );
          }
          return downloadFile(p.map.fileUrl, p.map.fileName);
        }),
      );

      const formData = new FormData();
      let errors = 0;

      downloadResults.forEach((result, index) => {
        if (result.status === "fulfilled") {
          const file = result.value;
          formData.append("files", file);
          formData.append(
            "paths[]",
            `/UserData/Maps/Downloaded/${campaign.name}`,
          );
        } else {
          errors++;
          console.error(`Failed to download map ${index + 1}:`, result.reason);
        }
      });

      const { error } = await uploadFiles(serverId, formData);
      if (error) {
        throw new Error(error);
      }

      if (errors > 0) {
        throw new Error(`Failed to download ${errors} maps`);
      }

      return downloadResults
        .map((result) =>
          result.status === "fulfilled" ? result.value.name : "",
        )
        .filter((name) => name !== "");
    },
  );
}

export async function addCampaignToServer(
  serverId: string,
  campaign:
    | CampaignWithNamesAndPlaylistMaps
    | ClubCampaignWithNamesAndPlaylistMaps["campaign"],
): Promise<ServerResponse> {
  return doServerActionWithAuth(
    [
      `servers:${serverId}:moderator`,
      `servers:${serverId}:admin`,
      `group:servers:${serverId}:moderator`,
      `group:servers:${serverId}:admin`,
    ],
    async () => {
      const fileManager = await getFileManager(serverId);
      if (!fileManager?.health) {
        throw new Error("File manager is not healthy");
      }

      const addResults = await Promise.allSettled(
        campaign.playlist.map((p) => {
          if (!p.map?.fileUrl) {
            return Promise.reject(
              new Error(`Map ${p.mapUid} does not have a valid download URL`),
            );
          }
          return addMapToServer(serverId, p.map.fileUrl, p.map.fileName);
        }),
      );

      let errors = 0;
      addResults.forEach((result, index) => {
        if (result.status === "rejected") {
          errors++;
          console.error(`Failed to add map ${index + 1}:`, result.reason);
        }
      });

      if (errors > 0) {
        throw new Error(`Failed to add ${errors} maps`);
      }
    },
  );
}
