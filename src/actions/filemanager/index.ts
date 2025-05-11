"use server";

import { doServerActionWithAuth } from "@/lib/actions";
import { getFileManager } from "@/lib/filemanager";
import { FileEntry } from "@/types/filemanager";
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
