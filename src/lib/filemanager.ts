import { getServers } from "@/actions/gbxconnector/servers";
import { FileManager } from "@/types/filemanager";

const cachedFileManagers: {
  [key: number]: FileManager;
} = {};

export async function syncFileManager(id: number): Promise<FileManager> {
  const servers = await getServers();

  const server = servers.find((server) => server.id == id);
  if (!server) {
    throw new Error(`Server ${id} not found`);
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

  cachedFileManagers[id] = fileManager;
  return fileManager;
}

export async function getFileManager(id: number): Promise<FileManager> {
  if (cachedFileManagers[id]) {
    return cachedFileManagers[id];
  }

  return await syncFileManager(id);
}
