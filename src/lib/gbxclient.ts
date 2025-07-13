import { onPlayerFinish } from "@/actions/gbx/listeners/records";
import { onPodiumStart, syncMap } from "@/actions/gbx/map";
import { syncPlayerList } from "@/actions/gbx/player";
import { GbxClient } from "@evotm/gbxclient";
import "server-only";
import { getClient } from "./dbclient";
import { appGlobals } from "./global";
import { withTimeout } from "./utils";

class GbxClientManager {
  private client: GbxClient;
  private serverId: string;
  private listeners: Record<string, (...args: any[]) => void> = {};
  private initialized = false;

  constructor(serverId: string) {
    this.serverId = serverId;
    this.client = new GbxClient({
      showErrors: true,
      throwErrors: true,
    });
  }

  async connect(): Promise<GbxClient> {
    if (!appGlobals.gbxClients?.[this.serverId]) {
      const db = getClient();

      const server = await db.servers.findUnique({
        where: { id: this.serverId },
      });

      if (!server) {
        throw new Error(`Server ${this.serverId} not found`);
      }

      const client = new GbxClient({
        showErrors: true,
        throwErrors: true,
      });

      console.log(
        `Connecting to GBX client for server ${server.id} at ${server.host}:${server.port}`,
      );

      try {
        const status = await withTimeout(
          client.connect(server.host, server.port),
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
        await client.call("Authenticate", server.user, server.password);
      } catch {
        throw new Error("Failed to authenticate with GBX client");
      }

      await client.call("SetApiVersion", "2023-04-24");
      await client.call("EnableCallbacks", true);
      await client.callScript("XmlRpc.EnableCallbacks", "true");
      await setupListeners(client, server.id);
      await syncPlayerList(client, server.id);
      await syncMap(client, server.id);

      appGlobals.gbxClients = appGlobals.gbxClients || {};
      appGlobals.gbxClients[server.id] = client;

      return client;
    }

    if (!appGlobals.gbxClients[this.serverId]) {
      throw new Error(`GbxClient for server ${this.serverId} not found`);
    }

    return appGlobals.gbxClients[this.serverId];
  }
}

export async function getGbxClient(serverId: string): Promise<GbxClient> {
  if (!appGlobals.gbxClients?.[serverId]) {
    const db = getClient();

    const server = await db.servers.findUnique({
      where: { id: serverId },
    });

    if (!server) {
      throw new Error(`Server ${serverId} not found`);
    }

    const client = new GbxClient({
      showErrors: true,
      throwErrors: true,
    });

    console.log(
      `Connecting to GBX client for server ${server.id} at ${server.host}:${server.port}`,
    );

    try {
      const status = await withTimeout(
        client.connect(server.host, server.port),
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
      await client.call("Authenticate", server.user, server.password);
    } catch {
      throw new Error("Failed to authenticate with GBX client");
    }

    await client.call("SetApiVersion", "2023-04-24");
    await client.call("EnableCallbacks", true);
    await client.callScript("XmlRpc.EnableCallbacks", "true");
    await setupListeners(client, server.id);
    await syncPlayerList(client, server.id);
    await syncMap(client, server.id);

    appGlobals.gbxClients = appGlobals.gbxClients || {};
    appGlobals.gbxClients[server.id] = client;

    return client;
  }

  if (!appGlobals.gbxClients[serverId]) {
    throw new Error(`GbxClient for server ${serverId} not found`);
  }

  return appGlobals.gbxClients[serverId];
}

async function setupListeners(
  client: GbxClient,
  serverId: string,
): Promise<void> {
  client.on("callback", (method: string, data: any) => {
    if (method === "ManiaPlanet.ModeScriptCallbackArray") {
      if (!data || data.length === 0) return;

      const methodName = data[0];
      const params = JSON.parse(data[1]) ?? data[1];

      switch (methodName) {
        case "Maniaplanet.Podium_Start":
          onPodiumStart(serverId);
          break;
        case "Trackmania.Event.WayPoint":
          if (params.isendrace) {
            onPlayerFinish(serverId, params.login, params.racetime);
          }
          break;
      }
    }
  });
}
