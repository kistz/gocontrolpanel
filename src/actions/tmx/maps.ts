"use server";

import { doServerActionWithAuth } from "@/lib/actions";
import { downloadTMXMap, searchTMXMaps } from "@/lib/api/tmx";
import { getFileManager } from "@/lib/filemanager";
import { TMXMapSearch } from "@/types/api/tmx";
import { ServerResponse } from "@/types/responses";
import { uploadFiles } from "../filemanager";
import { addMap } from "../gbx/map";

export async function searchMaps(
  serverId: string,
  queryParams: Record<string, string>,
  after?: number,
): Promise<ServerResponse<TMXMapSearch>> {
  return doServerActionWithAuth(
    [`servers:${serverId}:moderator`, `servers:${serverId}:admin`],
    async () => {
      return searchTMXMaps(
        {
          ...queryParams,
          ...(after ? { after: after.toString() } : {}),
        },
        12,
      );
    },
  );
}

export async function downloadMap(
  serverId: string,
  mapId: number,
): Promise<ServerResponse<string>> {
  return doServerActionWithAuth(
    [`servers:${serverId}:moderator`, `servers:${serverId}:admin`],
    async () => {
      const fileManager = await getFileManager(serverId);
      if (!fileManager?.health) {
        throw new Error("File manager is not healthy");
      }

      const file = await downloadTMXMap(mapId);
      if (!file) {
        throw new Error("Failed to download map");
      }

      const formData = new FormData();
      formData.append("files", file);
      formData.append("paths[]", `/UserData/Maps/Downloaded`);

      const { error } = await uploadFiles(serverId, formData);
      if (error) {
        throw new Error(error);
      }

      return file.name;
    },
  );
}

export async function addMapToServer(
  serverId: string,
  mapId: number,
): Promise<ServerResponse> {
  return doServerActionWithAuth(
    [`servers:${serverId}:moderator`, `servers:${serverId}:admin`],
    async () => {
      const fileManager = await getFileManager(serverId);
      if (!fileManager?.health) {
        throw new Error("File manager is not healthy");
      }

      const { data: fileName, error } = await downloadMap(serverId, mapId);
      if (error) {
        throw new Error(error);
      }

      const { error: addMapError } = await addMap(
        serverId,
        `Downloaded/${fileName}`,
      );
      if (addMapError) {
        throw new Error(addMapError);
      }
    },
  );
}
