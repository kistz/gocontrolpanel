"use server";
import { onPlayerFinish } from "@/actions/gbx/listeners/records";
import { onPodiumStart, syncMap } from "@/actions/gbx/map";
import { syncPlayerList } from "@/actions/gbx/player";
import { syncServers } from "@/actions/gbxconnector/servers";
import { GbxClient } from "@evotm/gbxclient";
import { withTimeout } from "./utils";

const globalForGbx = globalThis as unknown as {
  cachedClients?: { [key: string]: GbxClient };
};

const cachedClients = (globalForGbx.cachedClients ??= {});

export async function connectToGbxClient(
  serverUuid: string,
): Promise<GbxClient> {
  const servers = await syncServers();
  const server = servers.find((server) => server.uuid == serverUuid);

  if (!server) {
    throw new Error(`Server ${serverUuid} not found in cached servers`);
  }

  if (!server.isConnected) {
    throw new Error(`Server ${serverUuid} is not connected`);
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
  await setupListeners(client, server.uuid);
  await syncPlayerList(client, server.uuid);
  await syncMap(client, server.uuid);

  cachedClients[server.uuid] = client;
  return client;
}

export async function getGbxClient(serverUuid: string): Promise<GbxClient> {
  if (cachedClients[serverUuid]) {
    return cachedClients[serverUuid];
  }

  return await connectToGbxClient(serverUuid);
}

export async function disconnectGbxClient(serverUuid: string): Promise<void> {
  if (cachedClients[serverUuid]) {
    delete cachedClients[serverUuid];
  }
}

export async function setupListeners(
  client: GbxClient,
  serverUuid: string,
): Promise<void> {
  client.on("callback", (method: string, data: any) => {
    if (method === "ManiaPlanet.ModeScriptCallbackArray") {
      if (!data || data.length === 0) return;

      const methodName = data[0];
      const params = JSON.parse(data[1]) ?? data[1];

      switch (methodName) {
        case "Maniaplanet.Podium_Start":
          onPodiumStart(serverUuid);
          break;
        case "Trackmania.Event.WayPoint":
          if (params.isendrace) {
            onPlayerFinish(serverUuid, params.login, params.racetime);
          }
          break;
      }
    }
  });
}
