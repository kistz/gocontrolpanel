import { onPlayerFinish } from "@/actions/gbx/listeners/records";
import { onPodiumStart, syncMap } from "@/actions/gbx/map";
import { syncPlayerList } from "@/actions/gbx/player";
import { GbxClient } from "@evotm/gbxclient";
import EventEmitter from "events";
import "server-only";
import { getClient } from "./dbclient";
import { appGlobals } from "./global";
import { withTimeout } from "./utils";

export class GbxClientManager extends EventEmitter {
  private client: GbxClient;
  private serverId: string;
  private initialized = false;
  private isConnected = false;
  private reconnectTimeout: NodeJS.Timeout | null = null;

  constructor(serverId: string) {
    super();
    this.serverId = serverId;
    this.client = new GbxClient({
      showErrors: true,
      throwErrors: true,
    });

    this.client.on("disconnect", () => {
      if (!this.isConnected) return;
      console.log(`Disconnected from GBX client for server ${serverId}`);
      this.isConnected = false;
      this.emit("disconnect", serverId);
      this.scheduleReconnect(); // retry on disconnect
    });

    appGlobals.gbxClients = appGlobals.gbxClients || {};
    appGlobals.gbxClients[serverId] = this;
  }

  private scheduleReconnect() {
    if (this.reconnectTimeout) return; // avoid multiple schedules

    this.reconnectTimeout = setTimeout(() => {
      this.reconnectTimeout = null;
      this.tryConnectWithRetry();
    }, 15000);
  }

  private async tryConnectWithRetry() {
    try {
      await this.connect();
    } catch (err) {
      this.scheduleReconnect();
    }
  }

  async connect(): Promise<GbxClient> {
    const db = getClient();
    const server = await db.servers.findUnique({
      where: { id: this.serverId },
    });

    if (!server) throw new Error(`Server ${this.serverId} not found`);

    try {
      const status = await withTimeout(
        this.client.connect(server.host, server.port),
        3000,
        "Connection to GBX client timed out",
      );
      if (!status) throw new Error("Failed to connect to GBX client");
    } catch (error) {
      this.scheduleReconnect();
      throw new Error(`Failed to connect to GBX client: ${error}`);
    }

    try {
      await this.client.call("Authenticate", server.user, server.password);
    } catch {
      throw new Error("Failed to authenticate with GBX client");
    }

    this.isConnected = true;
    this.emit("connect", server.id);
    console.log(`Connected to GBX client for server ${server.name}`);

    await this.client.call("SetApiVersion", "2023-04-24");
    await this.client.call("EnableCallbacks", true);
    await this.client.callScript("XmlRpc.EnableCallbacks", "true");

    await setupListeners(this.client, server.id);
    await syncPlayerList(this.client, server.id);
    await syncMap(this.client, server.id);

    return this.client;
  }

  getClient(): GbxClient {
    return this.client;
  }

  getIsConnected(): boolean {
    return this.isConnected;
  }
}

export async function getGbxClient(serverId: string): Promise<GbxClient> {
  const manager = await getGbxClientManager(serverId);
  return manager.getClient();
}

export async function getGbxClientManager(
  serverId: string,
): Promise<GbxClientManager> {
  if (!appGlobals.gbxClients?.[serverId]) {
    const manager = new GbxClientManager(serverId);
    try {
      await manager.connect();
    } catch {}
  }

  if (!appGlobals.gbxClients?.[serverId]) {
    throw new Error(`GbxClientManager for server ${serverId} not found`);
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
