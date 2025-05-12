"use server";

import { doServerActionWithAuth } from "@/lib/actions";
import { getFileManager } from "@/lib/filemanager";
import { ContentType, File, FileEntry } from "@/types/filemanager";
import { ServerError, ServerResponse } from "@/types/responses";

export async function getUserData(
  server: number,
): Promise<ServerResponse<FileEntry[]>> {
  return doServerActionWithAuth(["admin"], async () => {
    const fileManager = await getFileManager(server);
    if (!fileManager.health) {
      throw new ServerError("Could not connect to file manager");
    }

    const res = await fetch(`${fileManager.url}/UserData`, {
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

    const parsedData = data.map((entry: any) => ({
      ...entry,
      lastModified: new Date(entry.lastModified),
    }));

    return parsedData;
  });
}

export async function getRoute(
  server: number,
  path: string,
): Promise<ServerResponse<FileEntry[]>> {
  return doServerActionWithAuth(["admin"], async () => {
    const fileManager = await getFileManager(server);
    if (!fileManager.health) {
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
  server: number,
  path: string,
): Promise<ServerResponse<File>> {
  return doServerActionWithAuth(["admin"], async () => {
    const fileManager = await getFileManager(server);
    if (!fileManager.health) {
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

    if (!data) {
      throw new ServerError("Failed to get files");
    }

    return {
      value: data,
      type: fileType,
    };
  });
}

export async function saveFileText(
  server: number,
  path: string,
  text: string,
): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const fileManager = await getFileManager(server);
    if (!fileManager.health) {
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
  server: number,
  path: string,
): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const fileManager = await getFileManager(server);
    if (!fileManager.health) {
      throw new ServerError("Could not connect to file manager");
    }

    const res = await fetch(fileManager.url + "/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([path]),
    });

    if (res.status !== 200) {
      throw new ServerError("Failed to delete item");
    }
  });
}

export async function getScripts(
  server: number,
): Promise<ServerResponse<string[]>> {
  return doServerActionWithAuth(["admin"], async () => {
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
      const fileManager = await getFileManager(server);
      if (!fileManager.health) {
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
  });
}
