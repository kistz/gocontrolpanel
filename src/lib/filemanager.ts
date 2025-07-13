import { syncServers } from "@/actions/gbxconnector/servers";
import { FileManager } from "@/types/filemanager";
import "server-only";

const cachedFileManagers: {
  [key: string]: FileManager;
} = {};

export async function syncFileManager(
  serverUuid: string,
): Promise<FileManager> {
  const servers = await syncServers();

  const server = servers.find((server) => server.uuid == serverUuid);
  if (!server) {
    throw new Error(`Server ${serverUuid} not found`);
  }

  if (!server.fmUrl) {
    return {
      url: server.fmUrl,
      health: false,
    };
  }

  const res = await fetch(`${server.fmUrl}/health`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const fileManager = {
    url: server.fmUrl,
    health: res.status === 200,
  };

  cachedFileManagers[serverUuid] = fileManager;
  return fileManager;
}

export async function getFileManager(
  serverUuid: string,
): Promise<FileManager | null> {
  if (cachedFileManagers[serverUuid]) {
    return cachedFileManagers[serverUuid];
  }

  try {
    return await syncFileManager(serverUuid);
  } catch {
    return null;
  }
}
