"use server";
import { onPlayerFinish } from "@/actions/gbx/listeners/records";
import { onPodiumStart, syncMap } from "@/actions/gbx/map";
import { syncPlayerList } from "@/actions/gbx/player";
import { getServers } from "@/actions/gbxconnector/servers";
import { GbxClient } from "@evotm/gbxclient";
import { withTimeout } from "./utils";

const globalForGbx = globalThis as unknown as {
  cachedClients?: { [key: number]: GbxClient };
};

const cachedClients = (globalForGbx.cachedClients ??= {});

export async function connectToGbxClient(id: number): Promise<GbxClient> {
  const servers = await getServers();
  const server = servers.find((server) => server.id == id);

  if (!server) {
    throw new Error(`Server ${id} not found in cached servers`);
  }

  if (!server.isConnected) {
    throw new Error(`Server ${id} is not connected`);
  }

  const client = new GbxClient({
    showErrors: true,
    throwErrors: true,
  });

  try {
    const status = await withTimeout(
      client.connect(server.host, server.xmlrpcPort),
      3000,
      "Connection to GBX client timed out",
    );
    if (!status) {
      throw new Error("Failed to connect to GBX client");
    }
  } catch (error) {
    throw new Error(`Failed to connect to GBX client: ${error}`);
  }

  try {
    await client.call("Authenticate", server.user, server.pass);
  } catch {
    throw new Error("Failed to authenticate with GBX client");
  }

  await client.call("SetApiVersion", "2023-04-24");
  await client.call("EnableCallbacks", true);
  await client.callScript("XmlRpc.EnableCallbacks", "true");
  await setupListeners(client, server.id);
  await syncPlayerList(client, server.id);
  await syncMap(client, server.id);

  cachedClients[server.id] = client;
  return client;
}

export async function getGbxClient(id: number): Promise<GbxClient> {
  if (cachedClients[id]) {
    return cachedClients[id];
  }

  return await connectToGbxClient(id);
}

export async function disconnectGbxClient(id: number): Promise<void> {
  if (cachedClients[id]) {
    delete cachedClients[id];
  }
}

export async function setupListeners(
  client: GbxClient,
  id: number,
): Promise<void> {
  client.on("callback", (method: string, data: any) => {
    if (method === "ManiaPlanet.ModeScriptCallbackArray") {
      if (!data || data.length === 0) return;

      const methodName = data[0];
      const params = JSON.parse(data[1]) ?? data[1];

      switch (methodName) {
        case "Maniaplanet.Podium_Start":
          onPodiumStart(id);
          break;
        case "Trackmania.Event.WayPoint":
          if (params.isendrace) {
            onPlayerFinish(id, params.login, params.racetime);
          }
          break;
      }
    }
  });
}
