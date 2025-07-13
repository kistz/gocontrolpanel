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
  private id: string;
  private listeners: Record<string, Function> = {};
  private initialized = false;

  constructor(id: string) {
    this.id = id;
    this.client = new GbxClient({
      showErrors: true,
      throwErrors: true,
    });
  }

  async connect(): Promise<GbxClient> {
    if (!appGlobals.gbxClients?.[this.id]) {
      const db = getClient();

      const server = await db.servers.findUnique({
        where: { id: this.id },
      });

      if (!server) {
        throw new Error(`Server ${this.id} not found`);
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

    if (!appGlobals.gbxClients[this.id]) {
      throw new Error(`GbxClient for server ${this.id} not found`);
    }

    return appGlobals.gbxClients[this.id];
  }
}

export async function getGbxClient(id: string): Promise<GbxClient> {
  if (!appGlobals.gbxClients?.[id]) {
    const db = getClient();

    const server = await db.servers.findUnique({
      where: { id },
    });

    if (!server) {
      throw new Error(`Server ${id} not found`);
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

  if (!appGlobals.gbxClients[id]) {
    throw new Error(`GbxClient for server ${id} not found`);
  }

  return appGlobals.gbxClients[id];
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
