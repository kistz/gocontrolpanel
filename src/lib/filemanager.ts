import { FileManager } from "@/types/filemanager";
import "server-only";
import { getClient } from "./dbclient";
import { appGlobals } from "./global";

export async function getFileManager(serverId: string): Promise<FileManager> {
  if (!appGlobals.fileManagers?.[serverId]) {
    const db = getClient();
    const server = await db.servers.findUnique({
      where: { id: serverId },
    });

    if (!server) {
      throw new Error(`Server with id ${serverId} not found`);
    }

    if (!server.filemanagerUrl) {
      return {
        url: server.filemanagerUrl,
        health: false,
      };
    }

    const res = await fetch(`${server.filemanagerUrl}/health`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const fileManager = {
      url: server.filemanagerUrl,
      health: res.status === 200,
    };

    appGlobals.fileManagers = appGlobals.fileManagers || {};
    appGlobals.fileManagers[serverId] = fileManager;

    return fileManager;
  }

  if (!appGlobals.fileManagers[serverId]) {
    throw new Error(`FileManager with id ${serverId} not found`);
  }

  return appGlobals.fileManagers[serverId];
}
