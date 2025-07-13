import { FileManager } from "@/types/filemanager";
import "server-only";
import { getClient } from "./dbclient";
import { appGlobals } from "./global";

export async function syncFileManager(
  id: string,
): Promise<FileManager> {
  const db = getClient();
  const server = await db.servers.findUnique({
    where: { id },
  });

  if (!server) {
    throw new Error(`Server with id ${id} not found`);
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
  appGlobals.fileManagers[id] = fileManager;

  return fileManager;
}

export async function getFileManager(
  serverUuid: string,
): Promise<FileManager | null> {
  if (appGlobals.fileManagers?.[serverUuid]) {
    return appGlobals.fileManagers[serverUuid];
  }

  try {
    return await syncFileManager(serverUuid);
  } catch {
    return null;
  }
}
