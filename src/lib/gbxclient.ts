import { onPlayerFinish } from "@/actions/gbx/listeners/records";
import { onPodiumStart, syncMap } from "@/actions/gbx/map";
import { syncPlayerList } from "@/actions/gbx/player";
import { syncServers } from "@/actions/gbxconnector/servers";
import { GbxClient } from "@evotm/gbxclient";
import "server-only";
import { appGlobals } from "./global";
import { withTimeout } from "./utils";

class GbxClientManager {
  private client: GbxClient;
  private serverUuid: string;
  private listeners: Record<string, Function> = {};
  private initialized = false;

  constructor(serverUuid: string) {
    this.serverUuid = serverUuid;
    this.client = new GbxClient({
      showErrors: true,
      throwErrors: true,
    });
  }

  async connect(): Promise<GbxClient> {
    const servers = await syncServers();
    const server = servers.find((s) => s.uuid === this.serverUuid);

    if (!server) {
      throw new Error(`Server ${this.serverUuid} not found in cached servers`);
    }

    if (!server.isConnected) {
      throw new Error(`Server ${this.serverUuid} is not connected`);
    }

    console.log(
      `Connecting to GBX client for server ${this.serverUuid} at ${server.host}:${server.xmlrpcPort}`,
    );

    try {
      const status = await withTimeout(
        this.client.connect(server.host, server.xmlrpcPort),
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
      await this.client.call("Authenticate", server.user, server.pass);
    } catch {
      throw new Error("Failed to authenticate with GBX client");
    }

    await this.client.call("SetApiVersion", "2023-04-24");
    await this.client.call("EnableCallbacks", true);
    await this.client.callScript("XmlRpc.EnableCallbacks", "true");

    await setupListeners(this.client, this.serverUuid);
    await syncPlayerList(this.client, this.serverUuid);
    await syncMap(this.client, this.serverUuid);

    appGlobals.gbxClients = appGlobals.gbxClients || {};
    appGlobals.gbxClients[this.serverUuid] = this.client;

    this.initialized = true;
    return this.client;
  }
}

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

  console.log(
    `Connecting to GBX client for server ${serverUuid} at ${server.host}:${server.xmlrpcPort}`,
  );

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

  if (appGlobals.gbxClients) {
    appGlobals.gbxClients[serverUuid] = client;
  } else {
    appGlobals.gbxClients = { [serverUuid]: client };
  }
  return client;
}

export async function getGbxClient(serverUuid: string): Promise<GbxClient> {
  if (appGlobals.gbxClients?.[serverUuid]) {
    return appGlobals.gbxClients[serverUuid];
  }

  return await connectToGbxClient(serverUuid);
}

export async function disconnectGbxClient(serverUuid: string): Promise<void> {
  delete appGlobals.gbxClients?.[serverUuid];
}

async function setupListeners(
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
