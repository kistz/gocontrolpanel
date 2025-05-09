import { getServers } from "@/actions/gbxconnector/servers";
import { FileManager } from "@/types/filemanager";

let cachedFileManagers: {
  [key: number]: FileManager;
} = {};

export async function syncFileManager(id: number): Promise<FileManager> {
  const servers = await getServers();

  const server = servers.find((server) => server.id == id);
  if (!server) {
    throw new Error(`Server ${id} not found`);
  }

  if (!server.fmHost || !server.fmPort) {
    return {
      host: server.fmHost,
      port: server.fmPort,
      health: false,
    };
  }

  const res = await fetch(`${server.fmHost}:${server.fmPort}/health`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  console.log(res, server.fmHost, server.fmPort);

  const fileManager = {
    host: server.fmHost,
    port: server.fmPort,
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
