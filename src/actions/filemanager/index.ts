"use server";

import { CreateFileEntrySchemaType } from "@/forms/server/files/create-file-entry-schema";
import { doServerActionWithAuth } from "@/lib/actions";
import { getFileManager } from "@/lib/filemanager";
import { ContentType, File, FileEntry } from "@/types/filemanager";
import { ServerError, ServerResponse } from "@/types/responses";

export async function getRoute(
  serverId: string,
  path: string,
): Promise<ServerResponse<FileEntry[]>> {
  return doServerActionWithAuth([`servers:${serverId}:admin`], async () => {
    const fileManager = await getFileManager(serverId);
    if (!fileManager?.health) {
      throw new ServerError("Could not connect to file manager");
    }

    const res = await fetch(fileManager.url + path, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.status !== 200) {
      throw new ServerError("Failed to get files");
    }

    let data: FileEntry[] | undefined;

    try {
      data = await res.json();
    } catch {
      throw new ServerError("Route is a file");
    }

    if (!data) {
      throw new ServerError("Failed to get files");
    }

    const parsedData = data.map((entry: any) => ({
      ...entry,
      lastModified: new Date(entry.lastModified),
    }));

    return parsedData;
  });
}

export async function getFile(
  serverId: string,
  path: string,
): Promise<ServerResponse<File>> {
  return doServerActionWithAuth([`servers:${serverId}:admin`], async () => {
    const fileManager = await getFileManager(serverId);
    if (!fileManager?.health) {
      throw new ServerError("Could not connect to file manager");
    }

    const res = await fetch(fileManager.url + path, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.status !== 200) {
      throw new ServerError("Failed to get files");
    }

    const contentType = res.headers.get("Content-Type");
    const fileType: ContentType = contentType
      ? (contentType.split("/")[0] as ContentType)
      : "text";

    const data =
      fileType === "image" || fileType === "video"
        ? await res.arrayBuffer()
        : await res.text();

    return {
      value: data,
      type: fileType,
    };
  });
}

export async function saveFileText(
  serverId: string,
  path: string,
  text: string,
): Promise<ServerResponse> {
  return doServerActionWithAuth([`servers:${serverId}:admin`], async () => {
    const fileManager = await getFileManager(serverId);
    if (!fileManager?.health) {
      throw new ServerError("Could not connect to file manager");
    }

    const res = await fetch(fileManager.url + path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(text),
    });

    if (res.status !== 200) {
      throw new ServerError("Failed to save file");
    }
  });
}

export async function deleteEntry(
  serverId: string,
  paths: string[],
): Promise<ServerResponse> {
  return doServerActionWithAuth([`servers:${serverId}:admin`], async () => {
    const fileManager = await getFileManager(serverId);
    if (!fileManager?.health) {
      throw new ServerError("Could not connect to file manager");
    }

    const res = await fetch(fileManager.url + "/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paths),
    });

    if (res.status !== 200) {
      throw new ServerError("Failed to delete item");
    }
  });
}

export async function uploadFiles(
  serverId: string,
  formData: FormData,
): Promise<ServerResponse<FileEntry[]>> {
  return doServerActionWithAuth([`servers:${serverId}:admin`], async () => {
    const fileManager = await getFileManager(serverId);
    if (!fileManager?.health) {
      throw new ServerError("Could not connect to file manager");
    }

    const res = await fetch(fileManager.url + "/upload", {
      method: "POST",
      body: formData,
    });

    if (res.status !== 200) {
      throw new ServerError("Failed to upload files");
    }

    const data = await res.json();
    if (!data) {
      throw new ServerError("Failed to upload files");
    }

    const parsedData = data.map((entry: any) => ({
      ...entry,
      lastModified: new Date(entry.lastModified),
    }));

    return parsedData;
  });
}

export async function getScripts(
  serverId: string,
): Promise<ServerResponse<string[]>> {
  return doServerActionWithAuth(
    [`servers:${serverId}:moderator`, `servers:${serverId}:admin`],
    async () => {
      const defaultScripts = [
        "Trackmania/TM_TimeAttack_Online.Script.txt",
        "Trackmania/TM_Laps_Online.Script.txt",
        "Trackmania/TM_Rounds_Online.Script.txt",
        "Trackmania/TM_Cup_Online.Script.txt",
        "Trackmania/TM_Teams_Online.Script.txt",
        "Trackmania/TM_Knockout_Online.Script.txt",
        "Trackmania/Deprecated/TM_Champion_Online.Script.txt",
        "Trackmania/TM_RoyalTimeAttack_Online.Script.txt",
        "Trackmania/TM_StuntMulti_Online.Script.txt",
        "Trackmania/TM_Platform_Online.Script.txt",
        "TrackMania/TM_TMWC2023_Online.Script.txt",
        "TrackMania/TM_TMWTTeams_Online.Script.txt",
      ];

      try {
        const fileManager = await getFileManager(serverId);
        if (!fileManager?.health) {
          throw new ServerError("Could not connect to file manager");
        }

        const res = await fetch(`${fileManager.url}/scripts`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (res.status !== 200) {
          throw new ServerError("Failed to get files");
        }

        const data = await res.json();
        if (!data) {
          throw new ServerError("Failed to get files");
        }

        const allScripts = [...data, ...defaultScripts];
        return [...new Set(allScripts)];
      } catch (error) {
        console.error("Error getting scripts:", error);
        return defaultScripts;
      }
    },
  );
}

export async function createFileEntry(
  serverId: string,
  request: CreateFileEntrySchemaType,
): Promise<ServerResponse<FileEntry>> {
  return doServerActionWithAuth([`servers:${serverId}:admin`], async () => {
    const fileManager = await getFileManager(serverId);
    if (!fileManager?.health) {
      throw new ServerError("Could not connect to file manager");
    }

    const res = await fetch(fileManager.url + "/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (res.status !== 200) {
      throw new ServerError(
        res.status === 500 ? "Something went wrong" : await res.text(),
      );
    }

    const data = await res.json();
    if (!data) {
      throw new ServerError("Failed to create file entry");
    }

    return {
      ...data,
      lastModified: new Date(data.lastModified),
    };
  });
}
