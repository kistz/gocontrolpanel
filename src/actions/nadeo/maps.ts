"use server";

import { doServerActionWithAuth } from "@/lib/actions";
import { downloadFile } from "@/lib/api/nadeo";
import { getFileManager } from "@/lib/filemanager";
import { ServerResponse } from "@/types/responses";
import { uploadFiles } from "../filemanager";
import { addMap } from "../gbx/map";

export async function downloadMapFromUrl(
  serverId: string,
  url: string,
  fileName: string,
): Promise<ServerResponse<string>> {
  return doServerActionWithAuth(
    [`servers:${serverId}:moderator`, `servers:${serverId}:admin`],
    async () => {
      const fileManager = await getFileManager(serverId);
      if (!fileManager?.health) {
        throw new Error("File manager is not healthy");
      }

      const file = await downloadFile(url, fileName);
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
  url: string,
  fileName: string,
): Promise<ServerResponse> {
  return doServerActionWithAuth(
    [`servers:${serverId}:moderator`, `servers:${serverId}:admin`],
    async () => {
      const fileManager = await getFileManager(serverId);
      if (!fileManager?.health) {
        throw new Error("File manager is not healthy");
      }

      const { data: file, error } = await downloadMapFromUrl(
        serverId,
        url,
        fileName,
      );
      if (error) {
        throw new Error(error);
      }

      const { error: addMapError } = await addMap(
        serverId,
        `Downloaded/${file}`,
      );
      if (addMapError) {
        throw new Error(addMapError);
      }
    },
  );
}
