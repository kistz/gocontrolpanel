import {
  createMatch,
  saveMatchRecord,
  saveRoundRecords,
  syncPlayer,
} from "@/actions/database/gbx";
import {
  getPlayerInfo,
  onPodiumStart,
  syncMap,
  syncPlayerList,
} from "@/actions/gbx/server-only";
import { EndMap, SMapInfo, StartMap } from "@/types/gbx/map";
import { PauseStatus } from "@/types/gbx/pause";
import { PlayerChat, SPlayerInfo } from "@/types/gbx/player";
import { Elmination, Player, Scores } from "@/types/gbx/scores";
import { WarmUp, WarmUpStatus } from "@/types/gbx/warmup";
import { GiveUp, Waypoint } from "@/types/gbx/waypoint";
import { PlayerRound, PlayerWaypoint, Team } from "@/types/live";
import { PlayerInfo } from "@/types/player";
import { ECMPluginConfig } from "@/types/plugins/ecm";
import { ServerClientInfo } from "@/types/server";
import { GbxClient } from "@evotm/gbxclient";
import EventEmitter from "events";
import "server-only";
import { ecmOnDriverFinish, ecmOnRoundEnd } from "./api/ecm";
import { handleAdminCommand } from "./commands";
import { getClient } from "./dbclient";
import { appGlobals } from "./global";
import {
  formatMessage,
  isFinalist,
  isWinner,
  sleep,
  withTimeout,
} from "./utils";

export class GbxClientManager extends EventEmitter {
  client: GbxClient;
  private serverId: string;
  info: ServerClientInfo;
  private isConnected = false;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private listenerMap: Map<string, Record<string, (...args: any[]) => void>> =
    new Map();
  currentMatchId: string | null = null;
  roundNumber: number | null = null;

  constructor(serverId: string) {
    super();
    this.serverId = serverId;
    this.client = new GbxClient({
      showErrors: true,
      throwErrors: true,
    });
    this.info = {
      activePlayers: [],
      liveInfo: {
        maps: [],
        players: {},
        activeRound: {
          players: {},
        },
        isWarmUp: false,
        mode: "",
        type: "",
        currentMap: "",
        pointsRepartition: [],
        pauseAvailable: false,
        isPaused: false,
      },
      plugins: [],
    };

    this.client.on("disconnect", this.onDisconnect.bind(this));

    appGlobals.gbxClients = appGlobals.gbxClients || {};
    appGlobals.gbxClients[serverId] = this;
  }

  private onDisconnect() {
    if (!this.isConnected) return;
    console.log(`Disconnected from GBX client for server ${this.serverId}`);
    this.isConnected = false;
    this.emit("disconnect", this.serverId);
    this.scheduleReconnect(); // retry on disconnect
  }

  addListeners(
    listenerId: string,
    listeners: Record<string, (...args: any[]) => void>,
  ) {
    for (const [event, handler] of Object.entries(listeners)) {
      this.on(event, handler);
    }
    this.listenerMap.set(listenerId, listeners);
  }

  removeListeners(listenerId: string) {
    const listeners = this.listenerMap.get(listenerId);
    if (!listeners) return;

    for (const [event, handler] of Object.entries(listeners)) {
      this.off(event, handler);
    }

    this.listenerMap.delete(listenerId);
  }

  stopReconnect() {
    this.client.removeListener("disconnect", this.onDisconnect.bind(this));
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
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
    } catch {
      this.scheduleReconnect();
    }
  }

  async connect(): Promise<GbxClient> {
    const db = getClient();
    const server = await db.servers.findUnique({
      where: { id: this.serverId },
      include: {
        serverPlugins: {
          include: {
            plugin: {
              include: {
                commands: true,
              },
            },
          },
        },
      },
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
    await this.client.callScript(
      "Trackmania.Event.SetCurRaceCheckpointsMode",
      "always",
    );

    await this.client.call("ChatEnableManualRouting", server.manualRouting);
    this.info.chat = {
      manualRouting: server.manualRouting,
      messageFormat: server.messageFormat,
      connectMessage: server.connectMessage,
      disconnectMessage: server.disconnectMessage,
    };

    this.info.plugins = server.serverPlugins;

    await setupListeners(this, server.id);
    await syncMap(this, server.id);
    await syncLiveInfo(this);

    return this.client;
  }

  getServerId(): string {
    return this.serverId;
  }

  getIsConnected(): boolean {
    return this.isConnected;
  }

  getActiveMap(): string | undefined {
    return this.info.activeMap;
  }

  addActivePlayer(player: PlayerInfo): void {
    if (!this.info.activePlayers.includes(player)) {
      this.info.activePlayers.push(player);
    }
  }

  removeActivePlayer(playerLogin: string): void {
    this.info.activePlayers = this.info.activePlayers.filter(
      (p) => p.login !== playerLogin,
    );
  }

  setActiveRoundPlayer(
    login: string,
    player: PlayerWaypoint | undefined,
  ): void {
    if (!this.info.liveInfo?.activeRound) {
      this.info.liveInfo.activeRound = {
        players: {},
      };
    }

    if (player) {
      this.info.liveInfo.activeRound.players = {
        ...this.info.liveInfo.activeRound.players,
        [login]: player,
      };
    } else {
      delete this.info.liveInfo.activeRound.players?.[login];
    }
  }

  setTeam(teamId: number, team: Team | undefined): void {
    if (!this.info.liveInfo.teams) {
      this.info.liveInfo.teams = {};
    }

    if (team) {
      this.info.liveInfo.teams[teamId] = team;
    } else {
      delete this.info.liveInfo.teams[teamId];
    }
  }

  setPlayer(login: string, player: PlayerRound | undefined): void {
    if (!this.info.liveInfo.players) {
      this.info.liveInfo.players = {};
    }

    if (player) {
      this.info.liveInfo.players[login] = player;
    } else {
      delete this.info.liveInfo.players[login];
    }
  }
}

export async function getGbxClient(serverId: string): Promise<GbxClient> {
  const manager = await getGbxClientManager(serverId);
  return manager.client;
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

export async function deleteGbxClientManager(serverId: string): Promise<void> {
  const manager = appGlobals.gbxClients?.[serverId];
  if (!manager) return;

  manager.emit("disconnect", manager.getServerId());
  manager.removeAllListeners();
  manager.stopReconnect();

  delete appGlobals.gbxClients?.[serverId];
}

async function callbackListener(
  manager: GbxClientManager,
  serverId: string,
  method: string,
  data: any,
) {
  switch (method) {
    case "ManiaPlanet.PlayerConnect":
      await onPlayerConnect(manager, data[0]);
      break;
    case "ManiaPlanet.PlayerDisconnect":
      await onPlayerDisconnect(manager, data[0]);
      break;
    case "ManiaPlanet.PlayerInfoChanged":
      onPlayerInfoChanged(manager, data[0]);
      break;
    case "ManiaPlanet.BeginMap":
      onBeginMap(manager, data[0]);
      break;
    case "ManiaPlanet.EndMap":
      onEndMap(manager, data[0]);
      break;
    case "ManiaPlanet.BeginMatch":
      await onBeginMatch(manager);
      break;
    case "ManiaPlanet.Echo":
      await onEcho(manager, {
        Internal: data[0],
        Public: data[1],
      });
      break;
    case "ManiaPlanet.PlayerChat":
      const chat: PlayerChat = {
        PlayerUid: data[0],
        Login: data[1],
        Text: data[2],
        IsRegistredCmd: data[3],
        Options: data[4],
      };
      await onPlayerChat(manager, chat);
      break;

    case "ManiaPlanet.ModeScriptCallbackArray":
      if (!data || data.length === 0) return;

      const methodName = data[0];
      const params = JSON.parse(data[1]) ?? data[1];

      switch (methodName) {
        case "Maniaplanet.Podium_Start":
          onPodiumStartScript(manager, serverId);
          break;
        case "Trackmania.Event.WayPoint":
          if (params.isendrace) {
            saveFinishRecord(manager, serverId, params);
            onPlayerFinishScript(manager, params);
            ecmPlayerFinish(manager, params);
          } else {
            onPlayerCheckpointScript(manager, params);
          }
          break;
        case "Maniaplanet.EndMap_Start":
          onEndMapStartScript(manager, params);
          break;
        case "Maniaplanet.StartMap_Start":
          onStartMapStartScript(manager, params);
          break;
        case "Maniaplanet.StartRound_Start":
          await onStartRoundStartScript(manager);
          break;
        case "Trackmania.Scores":
          if (params.section === "EndRound") {
            ecmEndRound(manager, params);
            await onEndRoundScript(manager, params);
          } else if (params.section === "PreEndRound") {
            await onPreEndRoundScript(manager, params);
          }
          await onScoresScript(manager, params);
          break;
        case "Trackmania.WarmUp.Status":
          onWarmUpStatusScript(manager, params);
          break;
        case "Maniaplanet.Pause.Status":
          onPauseStatusScript(manager, params);
          break;
        case "Trackmania.Event.GiveUp":
          onPlayerGiveUpScript(manager, params);
          break;
        case "Trackmania.WarmUp.Start":
          onWarmUpStartScript(manager);
          break;
        case "Trackmania.WarmUp.End":
          onWarmUpEndScript(manager);
          break;
        case "Trackmania.WarmUp.StartRound":
          await onWarmUpStartRoundScript(manager, params);
          break;
        case "Trackmania.Knockout.Elimination":
          await onElimination(manager, params);
          break;
      }
  }
}

async function setupListeners(
  manager: GbxClientManager,
  serverId: string,
): Promise<void> {
  manager.client.removeListener("callback", (method: string, data: any) =>
    callbackListener(manager, serverId, method, data),
  );
  manager.client.on("callback", (method: string, data: any) =>
    callbackListener(manager, serverId, method, data),
  );
}

async function onPlayerConnect(manager: GbxClientManager, login: string) {
  const playerInfo = await getPlayerInfo(manager.client, login);
  try {
    await syncPlayer(playerInfo);
  } catch (error) {
    console.error(
      `Failed to sync player ${playerInfo.login} on connect: ${error}`,
    );
  }
  manager.addActivePlayer(playerInfo);
  manager.emit("playerConnect", playerInfo);

  manager.setPlayer(playerInfo.login, {
    ...manager.info.liveInfo.players?.[playerInfo.login],
    login: playerInfo.login,
    name: playerInfo.nickName,
    team: playerInfo.teamId,
  });

  if (playerInfo.spectatorStatus === 0) {
    const playerWaypoint: PlayerWaypoint = {
      login: playerInfo.login,
      accountId: "",
      time: 0,
      hasFinished: false,
      hasGivenUp: false,
      isFinalist: false,
      checkpoint: 0,
    };

    manager.setActiveRoundPlayer(playerWaypoint.login, playerWaypoint);
  } else {
    manager.setActiveRoundPlayer(playerInfo.login, undefined);
  }

  manager.emit("playerConnectInfo", manager.info.liveInfo);

  if (!manager.info.chat?.connectMessage) return;

  const message = formatMessage(
    manager.info.chat.connectMessage,
    playerInfo.login,
    playerInfo.nickName,
    "",
  );

  manager.client.call("ChatSendServerMessage", message);
}

async function onPlayerDisconnect(manager: GbxClientManager, login: string) {
  if (manager.info.chat?.disconnectMessage) {
    let player = manager.info.activePlayers.find((p) => p.login === login);
    if (!player) {
      player = await getPlayerInfo(manager.client, login);
    }

    const message = formatMessage(
      manager.info.chat.disconnectMessage,
      player.login,
      player.nickName,
      "",
    );

    manager.client.call("ChatSendServerMessage", message);
  }

  manager.removeActivePlayer(login);
  manager.emit("playerDisconnect", login);

  manager.setPlayer(login, {
    ...manager.info.liveInfo.players?.[login],
    connected: false,
  });

  manager.setActiveRoundPlayer(login, undefined);
  manager.emit("playerDisconnectInfo", manager.info.liveInfo.activeRound);
}

function onPlayerInfoChanged(
  manager: GbxClientManager,
  playerInfo: SPlayerInfo,
) {
  const changedInfo: PlayerInfo = {
    login: playerInfo.Login,
    nickName: playerInfo.NickName,
    playerId: playerInfo.PlayerId,
    spectatorStatus: playerInfo.SpectatorStatus,
    teamId: playerInfo.TeamId,
  };

  if (!changedInfo.login) return;

  manager.removeActivePlayer(changedInfo.login);
  manager.addActivePlayer(changedInfo);
  manager.emit("playerInfo", changedInfo);

  const playerRound: PlayerRound = {
    ...manager.info.liveInfo.players?.[changedInfo.login],
    team: changedInfo.teamId,
    name: changedInfo.nickName,
  };

  manager.setPlayer(changedInfo.login, playerRound);

  if (playerInfo.SpectatorStatus !== 0) {
    manager.setActiveRoundPlayer(changedInfo.login, undefined);
  } else {
    const playerWaypoint: PlayerWaypoint = {
      login: changedInfo.login,
      accountId: "",
      time: 0,
      hasFinished: false,
      hasGivenUp: false,
      isFinalist: isFinalist(
        playerRound.matchPoints,
        manager.info.liveInfo.pointsLimit,
      ),
      checkpoint: 0,
    };

    manager.setActiveRoundPlayer(playerWaypoint.login, playerWaypoint);
  }

  manager.emit("playerInfoChanged", manager.info.liveInfo.activeRound);
}

function onPodiumStartScript(_: GbxClientManager, serverId: string) {
  onPodiumStart(serverId);
}

function ecmPlayerFinish(manager: GbxClientManager, waypoint: Waypoint) {
  if (!manager.info.activeMap) return;

  if (manager.info.liveInfo.isWarmUp || manager.info.liveInfo.isPaused) return;

  const ecmPlugin = manager.info.plugins.find((p) => p.plugin.name === "ecm");
  if (!ecmPlugin || !ecmPlugin.enabled) return;

  const pluginConfig = ecmPlugin.config as ECMPluginConfig;
  if (!pluginConfig.apiKey) return;

  // Send data to eCircuitMania
  ecmOnDriverFinish(pluginConfig.apiKey, {
    finishTime: waypoint.racetime,
    ubisoftUid: waypoint.accountid,
    roundNum: manager.roundNumber || 1,
    mapId: manager.info.activeMap,
  });
}

function saveFinishRecord(
  manager: GbxClientManager,
  serverId: string,
  waypoint: Waypoint,
) {
  if (manager.info.liveInfo.isWarmUp || manager.info.liveInfo.isPaused) return;

  if (manager.roundNumber === 0) manager.roundNumber = 1;

  saveMatchRecord(
    serverId,
    manager.currentMatchId,
    waypoint,
    manager.roundNumber,
  );
}

function onPlayerFinishScript(manager: GbxClientManager, waypoint: Waypoint) {
  const playerWaypoint = {
    ...manager.info.liveInfo.activeRound?.players?.[waypoint.login],
    login: waypoint.login,
    accountId: waypoint.accountid,
    time: waypoint.racetime,
    hasFinished: true,
    hasGivenUp: false,
    checkpoint: waypoint.checkpointinrace + 1,
  };

  manager.setActiveRoundPlayer(playerWaypoint.login, playerWaypoint);
  manager.emit("finish", manager.info.liveInfo?.activeRound);

  if (manager.info.liveInfo?.type !== "timeattack") {
    return;
  }

  const playerRound = manager.info.liveInfo.players?.[playerWaypoint.login];
  if (
    !playerRound ||
    (playerRound.bestTime > 0 && playerRound.bestTime <= waypoint.racetime)
  )
    return;

  manager.info.liveInfo.players[playerWaypoint.login] = {
    ...playerRound,
    bestTime: waypoint.racetime,
    bestCheckpoints: waypoint.curracecheckpoints,
  };

  manager.emit("personalBest", manager.info.liveInfo);
}

function onPlayerCheckpointScript(
  manager: GbxClientManager,
  waypoint: Waypoint,
) {
  const playerWaypoint: PlayerWaypoint = {
    ...manager.info.liveInfo.activeRound?.players?.[waypoint.login],
    login: waypoint.login,
    accountId: waypoint.accountid,
    time: waypoint.racetime,
    hasFinished: false,
    hasGivenUp: false,
    checkpoint: waypoint.checkpointinrace + 1,
  };

  manager.setActiveRoundPlayer(playerWaypoint.login, playerWaypoint);
  manager.emit("checkpoint", manager.info.liveInfo?.activeRound);
}

function onEndMapStartScript(manager: GbxClientManager, endMap: EndMap) {
  manager.info.activeMap = endMap.map.uid;
  manager.emit("endMap", endMap.map.uid);
}

function onStartMapStartScript(manager: GbxClientManager, startMap: StartMap) {
  manager.info.activeMap = startMap.map.uid;
  manager.emit("startMap", startMap.map.uid);
}

async function onStartRoundStartScript(manager: GbxClientManager) {
  if (manager.roundNumber !== null && !manager.info.liveInfo.isWarmUp)
    manager.roundNumber++;

  const playerList: SPlayerInfo[] = await manager.client.call(
    "GetPlayerList",
    1000,
    0,
  );

  manager.info.liveInfo.activeRound = {
    players: {},
  };

  playerList.forEach((player) => {
    if (player.SpectatorStatus === 0) {
      const playerInfo = manager.info.liveInfo.players[player.Login];

      const playerWaypoint: PlayerWaypoint = {
        login: player.Login,
        accountId: playerInfo.accountId,
        time: 0,
        hasFinished: false,
        hasGivenUp: false,
        isFinalist: isFinalist(
          playerInfo.matchPoints,
          manager.info.liveInfo.pointsLimit,
        ),
        checkpoint: 0,
      };

      manager.setActiveRoundPlayer(playerWaypoint.login, playerWaypoint);
    }
  });

  manager.emit("beginRound", manager.info.liveInfo.activeRound);
}

function ecmEndRound(manager: GbxClientManager, scores: Scores) {
  const roundNum = manager.roundNumber || 1;

  if (!manager.info.activeMap) return;

  if (manager.info.liveInfo.isWarmUp || manager.info.liveInfo.isPaused) return;

  const ecmPlugin = manager.info.plugins.find((p) => p.plugin.name === "ecm");
  if (!ecmPlugin || !ecmPlugin.enabled) return;

  const pluginConfig = ecmPlugin.config as ECMPluginConfig;
  if (!pluginConfig.apiKey) return;

  const rankedPlayers = rankPlayers(
    scores.players,
    manager.info.liveInfo.type === "timeattack",
  );

  const players = rankedPlayers.map((p) => ({
    finishTime:
      manager.info.liveInfo.type === "timeattack"
        ? p.bestracetime
        : p.prevracetime,
    ubisoftUid: p.accountid,
    position: p.position,
  }));

  ecmOnRoundEnd(pluginConfig.apiKey, {
    players,
    roundNum,
    mapId: manager.info.activeMap,
  });
}

async function onEndRoundScript(manager: GbxClientManager, scores: Scores) {
  if (scores.useteams) {
    scores.teams.forEach((team) => {
      const updatedTeam: Team = {
        ...manager.info.liveInfo.teams?.[team.id],
        id: team.id,
        name: team.name,
        matchPoints: team.matchpoints,
        roundPoints:
          manager.info.liveInfo.type === "tmwc" ||
          manager.info.liveInfo.type === "tmwt"
            ? team.mappoints
            : team.roundpoints,
      };

      manager.setTeam(team.id, updatedTeam);
    });
  }

  scores.players.forEach((player) => {
    const playerRound: PlayerRound = {
      ...manager.info.liveInfo.players?.[player.login],
      roundPoints: player.roundpoints,
      matchPoints: player.matchpoints,
      finalist: isFinalist(
        player.matchpoints,
        manager.info.liveInfo.pointsLimit,
      ),
      winner: isWinner(player.matchpoints, manager.info.liveInfo.pointsLimit),
      bestTime: player.bestracetime,
      bestCheckpoints: player.bestracecheckpoints,
      prevTime: player.prevracetime,
      prevCheckpoints: player.prevracecheckpoints,
    };

    manager.setPlayer(playerRound.login, playerRound);
  });

  await manager.client.callScript(
    "Maniaplanet.Pause.GetStatus",
    "gocontrolpanel",
  );

  await sleep(300); // wait for the pause status to be updated

  manager.emit("endRound", manager.info.liveInfo);
}

async function onPreEndRoundScript(manager: GbxClientManager, scores: Scores) {
  if (manager.info.liveInfo.isWarmUp || manager.info.liveInfo.isPaused) return;

  if (manager.roundNumber === 0) manager.roundNumber = 1;

  saveRoundRecords(
    manager.getServerId(),
    manager.currentMatchId,
    scores,
    manager.roundNumber,
  );
}

function onPauseStatusScript(manager: GbxClientManager, status: PauseStatus) {
  if (status.responseid !== "gocontrolpanel") return;

  if (
    manager.info.liveInfo.isPaused !== status.active &&
    manager.roundNumber !== null &&
    manager.roundNumber > 0
  ) {
    manager.roundNumber--;
  }

  manager.info.liveInfo.pauseAvailable = status.available;
  manager.info.liveInfo.isPaused = status.active;
}

function onBeginMap(manager: GbxClientManager, mapInfo: SMapInfo) {
  syncMap(manager, manager.getServerId());

  manager.info.liveInfo.currentMap = mapInfo.UId;
  manager.roundNumber = manager.info.liveInfo.type === "timeattack" ? null : 0;

  manager.emit("beginMap", mapInfo.UId);
}

function onEndMap(manager: GbxClientManager, mapInfo: SMapInfo) {
  manager.emit("endMap", mapInfo.UId);
}

async function onBeginMatch(manager: GbxClientManager) {
  await syncLiveInfo(manager);

  await sleep(300);

  manager.emit("beginMatch", manager.info.liveInfo);
}

function onWarmUpStatusScript(manager: GbxClientManager, status: WarmUpStatus) {
  if (status.responseid !== "gocontrolpanel") return;

  manager.info.liveInfo.isWarmUp = status.active;
}

async function onScoresScript(manager: GbxClientManager, scores: Scores) {
  if (scores.responseid !== "gocontrolpanel") return;

  if (scores.useteams) {
    scores.teams.forEach((team) => {
      const updatedTeam: Team = {
        id: team.id,
        name: team.name,
        matchPoints: team.matchpoints,
        roundPoints:
          manager.info.liveInfo.type === "tmwc" ||
          manager.info.liveInfo.type === "tmwt"
            ? team.mappoints
            : team.roundpoints,
      };

      manager.setTeam(team.id, updatedTeam);
    });
  }

  // Sort players by matchpoints
  scores.players.sort((a, b) => {
    if (a.matchpoints !== b.matchpoints) {
      return b.matchpoints - a.matchpoints; // Sort by match points descending
    }
    return a.bestracetime - b.bestracetime; // Sort by best time ascending
  });

  for (let i = 0; i < scores.players.length; i++) {
    const player = scores.players[i];
    const playerRound: PlayerRound = {
      login: player.login,
      accountId: player.accountid,
      name: player.name,
      team: player.team,
      rank: player.rank,
      finalist: isFinalist(
        player.matchpoints,
        manager.info.liveInfo.pointsLimit,
      ),
      winner: isWinner(player.matchpoints, manager.info.liveInfo.pointsLimit),
      eliminated: false,
      roundPoints: player.roundpoints,
      matchPoints: player.matchpoints,
      bestTime: player.bestracetime,
      bestCheckpoints: player.bestracecheckpoints,
      prevTime: player.prevracetime,
      prevCheckpoints: player.prevracecheckpoints,
      connected: true,
    };

    manager.setPlayer(playerRound.login, playerRound);
  }

  const playerList: SPlayerInfo[] = await manager.client.call(
    "GetPlayerList",
    1000,
    0,
  );

  manager.info.liveInfo.activeRound = {
    players: {},
  };

  playerList.forEach((player) => {
    if (player.SpectatorStatus === 0) {
      const playerInfo = manager.info.liveInfo.players[player.Login];

      const playerWaypoint: PlayerWaypoint = {
        login: player.Login,
        accountId: playerInfo.accountId,
        time: 0,
        hasFinished: false,
        hasGivenUp: false,
        isFinalist: playerInfo.finalist,
        checkpoint: 0,
      };

      manager.setActiveRoundPlayer(playerWaypoint.login, playerWaypoint);
    }
  });
}

async function syncLiveInfo(manager: GbxClientManager) {
  await syncPlayerList(manager);

  await manager.client.callScript(
    "Trackmania.WarmUp.GetStatus",
    "gocontrolpanel",
  );

  const mode = await manager.client.call("GetScriptName");
  const currentMode: string = mode.CurrentValue;

  manager.info.liveInfo.mode = currentMode;
  const modeLower = currentMode.toLowerCase();

  const types = [
    "timeattack",
    "rounds",
    "cup",
    "tmwc",
    "tmwt",
    "teams",
    "knockout",
  ] as const;

  const matched = types.find((t) => modeLower.includes(t));
  manager.info.liveInfo.type = matched ?? "rounds";

  const match = await createMatch(
    manager.getServerId(),
    manager.info.liveInfo.mode,
  );
  manager.currentMatchId = match.id;
  manager.roundNumber = manager.info.liveInfo.type === "timeattack" ? null : 0;

  const mapInfo = await manager.client.call("GetCurrentMapInfo");

  manager.info.liveInfo.currentMap = mapInfo.UId;

  await setScriptSettings(manager);

  const mapList = await manager.client.call("GetMapList", 1000, 0);
  manager.info.liveInfo.maps = mapList.map((map: SMapInfo) => map.UId);

  await manager.client.callScript("Trackmania.GetScores", "gocontrolpanel");
  await manager.client.callScript(
    "Maniaplanet.Pause.GetStatus",
    "gocontrolpanel",
  );
}

async function setScriptSettings(manager: GbxClientManager) {
  const scriptSettings = await manager.client.call("GetModeScriptSettings");

  const type = manager.info.liveInfo.type;
  let plVar = "S_PointsLimit";
  let mlVar = "S_MapsPerMatch";
  let prVar = "S_PointsRepartition";

  if (type === "tmwc" || type === "tmwt") {
    plVar = "S_MapPointsLimit";
    mlVar = "S_MatchPointsLimit";
  }

  if (type === "knockout") {
    prVar = "S_EliminatedPlayersNbRanks";
  }

  // Points limit
  const pointsLimit = Number(scriptSettings[plVar]);
  if (!isNaN(pointsLimit) && pointsLimit > 0) {
    manager.info.liveInfo.pointsLimit = pointsLimit;
  } else {
    console.debug(
      "PointsLimit not found or invalid for server",
      manager.getServerId(),
    );
  }

  // Rounds limit
  const roundsLimit = Number(scriptSettings["S_RoundsPerMap"]);
  if (!isNaN(roundsLimit) && roundsLimit > 0) {
    manager.info.liveInfo.roundsLimit = roundsLimit;
  } else {
    console.debug(
      "RoundsLimit not found or invalid for server",
      manager.getServerId(),
    );
  }

  // Map limit
  const mapLimit = Number(scriptSettings[mlVar]);
  if (!isNaN(mapLimit) && mapLimit > 0) {
    manager.info.liveInfo.mapLimit = mapLimit;
  } else {
    console.debug(
      "MapLimit not found or invalid for server",
      manager.getServerId(),
    );
  }

  // Number of winners
  const nbWinners = Number(scriptSettings["S_NbOfWinners"]);
  if (!isNaN(nbWinners) && nbWinners > 0) {
    manager.info.liveInfo.nbWinners = nbWinners;
  } else {
    console.debug(
      "NbOfWinners not found or invalid for server",
      manager.getServerId(),
    );
  }

  // Points repartition
  const pointsRepartition = scriptSettings[prVar];
  if (typeof pointsRepartition === "string" && pointsRepartition.length > 0) {
    const list = pointsRepartition
      .split(",")
      .map((x: string) => parseInt(x.trim(), 10))
      .filter((x) => !isNaN(x));
    manager.info.liveInfo.pointsRepartition = list;
  } else {
    console.debug(
      "PointsRepartition not found or invalid for server",
      manager.getServerId(),
    );
  }
}

function onPlayerGiveUpScript(manager: GbxClientManager, giveUp: GiveUp) {
  const playerWaypoint: PlayerWaypoint = {
    ...manager.info.liveInfo.activeRound?.players?.[giveUp.login],
    hasGivenUp: true,
  };

  manager.setActiveRoundPlayer(playerWaypoint.login, playerWaypoint);
  manager.emit("giveUp", manager.info.liveInfo?.activeRound);
}

function onWarmUpStartScript(manager: GbxClientManager) {
  manager.info.liveInfo.isWarmUp = true;
  manager.emit("warmUpStart", manager.info.liveInfo);
}

function onWarmUpEndScript(manager: GbxClientManager) {
  manager.info.liveInfo.isWarmUp = false;
  manager.emit("warmUpEnd", manager.info.liveInfo);
}

async function onWarmUpStartRoundScript(
  manager: GbxClientManager,
  warmUp: WarmUp,
) {
  manager.info.liveInfo.isWarmUp = true;
  manager.info.liveInfo.warmUpRound = warmUp.current;
  manager.info.liveInfo.warmUpTotalRounds = warmUp.total;

  const playerList: SPlayerInfo[] = await manager.client.call(
    "GetPlayerList",
    1000,
    0,
  );

  manager.info.liveInfo.activeRound = {
    players: {},
  };

  playerList.forEach((player) => {
    if (player.SpectatorStatus === 0) {
      const playerInfo = manager.info.liveInfo.players[player.Login];

      const playerWaypoint: PlayerWaypoint = {
        login: player.Login,
        accountId: playerInfo.accountId,
        time: 0,
        hasFinished: false,
        hasGivenUp: false,
        isFinalist: isFinalist(
          playerInfo.matchPoints,
          manager.info.liveInfo.pointsLimit,
        ),
        checkpoint: 0,
      };

      manager.setActiveRoundPlayer(playerWaypoint.login, playerWaypoint);
    }
  });

  manager.emit("warmUpStartRound", manager.info.liveInfo);
}

async function onEcho(
  manager: GbxClientManager,
  echo: {
    Internal: string;
    Public: string;
  },
) {
  if (echo.Internal === "UpdatedSettings") {
    await setScriptSettings(manager);
    manager.emit("updatedSettings", manager.info.liveInfo);
  }
}

async function onElimination(
  manager: GbxClientManager,
  elimination: Elmination,
) {
  elimination.accountids.forEach((accountId) => {
    const player = Object.values(manager.info.liveInfo.players).find(
      (p) => p.accountId === accountId,
    );

    if (player) {
      const playerRound: PlayerRound = {
        ...manager.info.liveInfo.players?.[player.login],
        eliminated: true,
      };

      manager.setPlayer(playerRound.login, playerRound);
    }
  });

  manager.emit("elimination", manager.info.liveInfo);
}

async function handleCommand(manager: GbxClientManager, chat: PlayerChat) {
  if (manager.info.plugins.length === 0) return;
  if (!manager.info.plugins.some((c) => c.enabled)) return;

  const command = chat.Text.split(" ")[0].toLowerCase();
  const params = chat.Text.split(" ").slice(1);

  const plugin = manager.info.plugins.find((p) =>
    p.plugin.commands?.some((c) => c.command.toLowerCase() === command),
  );

  if (!plugin || !plugin.enabled) return;

  switch (command) {
    case "/admin":
      await handleAdminCommand(manager, chat, params);
      break;
  }
}

async function onPlayerChat(manager: GbxClientManager, chat: PlayerChat) {
  if (!chat.Login) return;
  if (chat.Text.startsWith("/")) {
    return await handleCommand(manager, chat);
  }
  if (!manager.info.chat?.manualRouting) return;

  if (!manager.info.chat?.messageFormat) {
    manager.client.call("ChatForwardToLogin", chat.Text, chat.Login, "");
    return;
  }

  let player = manager.info.activePlayers.find((p) => p.login === chat.Login);

  if (!player) {
    player = await getPlayerInfo(manager.client, chat.Login);
  }

  const message = formatMessage(
    manager.info.chat?.messageFormat,
    player.login,
    player.nickName,
    chat.Text,
  );

  manager.client.call("ChatSendServerMessage", message);
}

function rankPlayers(
  players: Player[],
  ta?: boolean,
): (Player & { position: number })[] {
  return [...players]
    .sort((a, b) => {
      const racetimeA = ta ? a.bestracetime : a.prevracetime;
      const racetimeB = ta ? b.bestracetime : b.prevracetime;

      if (racetimeA === -1 && racetimeB === -1) return 0; // order doesn't matter
      if (racetimeA === -1) return 1; // a goes last
      if (racetimeB === -1) return -1; // b goes last

      // 1️⃣ Compare total prevracetime
      if (racetimeA !== racetimeB) return racetimeA - racetimeB;

      // 2️⃣ Tie-break: compare checkpoints from last to first (excluding first checkpoint if needed)
      const cpA = ta ? a.bestracecheckpoints : a.prevracecheckpoints;
      const cpB = ta ? b.bestracecheckpoints : b.prevracecheckpoints;
      const len = Math.min(cpA.length, cpB.length);

      for (let i = len - 1; i >= 0; i--) {
        if (cpA[i] !== cpB[i]) return cpA[i] - cpB[i];
      }

      // 3️⃣ Fully equal
      return 0;
    })
    .map((player, index) => ({
      ...player,
      position: index + 1,
    }));
}
