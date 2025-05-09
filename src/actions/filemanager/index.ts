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

    const res = await fetch(
      `${fileManager.host}:${fileManager.port}/UserData`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (res.status !== 200) {
      throw new ServerError("Failed to get files");
    }

    const data = await res.json();
    if (!data) {
      throw new ServerError("Failed to get files");
    }

    return data;
  });
}
