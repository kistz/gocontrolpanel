"use server";

import { doServerActionWithAuth } from "@/lib/actions";
import { getGbxClient } from "@/lib/gbxclient";
import { getKeyPlayers, getRedisClient } from "@/lib/redis";
import { PlayerInfo } from "@/types/player";
import { ServerResponse } from "@/types/responses";
import { GbxClient } from "@evotm/gbxclient";

export async function getPlayerList(
  id: string,
): Promise<ServerResponse<PlayerInfo[]>> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(id);
    const playerList = await client.call("GetPlayerList", 1000, 0);

    if (!playerList || !Array.isArray(playerList)) {
      return [];
    }

    const players: PlayerInfo[] = [];
    for (const player of playerList) {
      try {
        players.push({
          nickName: player.NickName,
          login: player.Login,
          playerId: player.PlayerId,
          spectatorStatus: player.SpectatorStatus,
          teamId: player.TeamId,
        });
      } catch {
        players.push({
          nickName: "-",
          login: player.Login,
          playerId: 0,
          spectatorStatus: 0,
          teamId: 0,
        });
      }
    }

    return players;
  });
}

export async function banPlayer(
  id: string,
  login: string,
  reason: string,
): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(id);
    await client.call("Ban", login, reason);
  });
}

export async function unbanPlayer(
  id: string,
  login: string,
): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(id);
    await client.call("UnBan", login);
  });
}

export async function getBanList(
  id: string,
): Promise<ServerResponse<PlayerInfo[]>> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(id);
    const banList = await client.call("GetBanList", 1000, 0);

    const playerList: PlayerInfo[] = [];
    for (const player of banList) {
      try {
        const playerInfo = await client.call("GetPlayerInfo", player.Login);
        playerList.push({
          nickName: playerInfo.NickName,
          login: playerInfo.Login,
          playerId: playerInfo.PlayerId,
          spectatorStatus: playerInfo.SpectatorStatus,
          teamId: playerInfo.TeamId,
        });
      } catch {
        playerList.push({
          nickName: "-",
          login: player.Login,
          playerId: 0,
          spectatorStatus: 0,
          teamId: 0,
        });
      }
    }

    return playerList;
  });
}

export async function cleanBanList(id: string): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(id);
    await client.call("CleanBanList");
  });
}

export async function blacklistPlayer(
  id: string,
  login: string,
): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(id);
    await client.call("BlackList", login);
  });
}

export async function unblacklistPlayer(
  id: string,
  login: string,
): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(id);
    await client.call("UnBlackList", login);
  });
}

export async function getBlacklist(
  id: string,
): Promise<ServerResponse<PlayerInfo[]>> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(id);
    const blacklist = await client.call("GetBlackList", 1000, 0);

    const playerList: PlayerInfo[] = [];
    for (const player of blacklist) {
      try {
        const playerInfo = await client.call("GetPlayerInfo", player.Login);
        playerList.push({
          nickName: playerInfo.NickName,
          login: playerInfo.Login,
          playerId: playerInfo.PlayerId,
          spectatorStatus: playerInfo.SpectatorStatus,
          teamId: playerInfo.TeamId,
        });
      } catch {
        playerList.push({
          nickName: "-",
          login: player.Login,
          playerId: 0,
          spectatorStatus: 0,
          teamId: 0,
        });
      }
    }

    return playerList;
  });
}

export async function loadBlacklist(
  id: string,
  filename: string,
): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(id);
    await client.call("LoadBlackList", filename);
  });
}

export async function saveBlacklist(
  id: string,
  filename: string,
): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(id);
    await client.call("SaveBlackList", filename);
  });
}

export async function cleanBlacklist(id: string): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(id);
    await client.call("CleanBlackList");
  });
}

export async function addGuest(
  id: string,
  login: string,
): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(id);
    await client.call("AddGuest", login);
  });
}

export async function removeGuest(
  id: string,
  login: string,
): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(id);
    await client.call("RemoveGuest", login);
  });
}

export async function getGuestlist(
  id: string,
): Promise<ServerResponse<PlayerInfo[]>> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(id);
    const guestlist = await client.call("GetGuestList", 1000, 0);

    const playerList: PlayerInfo[] = [];
    for (const player of guestlist) {
      try {
        const playerInfo = await client.call("GetPlayerInfo", player.Login);
        playerList.push({
          nickName: playerInfo.NickName,
          login: playerInfo.Login,
          playerId: playerInfo.PlayerId,
          spectatorStatus: playerInfo.SpectatorStatus,
          teamId: playerInfo.TeamId,
        });
      } catch {
        playerList.push({
          nickName: "-",
          login: player.Login,
          playerId: 0,
          spectatorStatus: 0,
          teamId: 0,
        });
      }
    }

    return playerList;
  });
}

export async function loadGuestlist(
  id: string,
  filename: string,
): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(id);
    await client.call("LoadGuestList", filename);
  });
}

export async function saveGuestlist(
  id: string,
  filename: string,
): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(id);
    await client.call("SaveGuestList", filename);
  });
}

export async function cleanGuestlist(id: string): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(id);
    await client.call("CleanGuestList");
  });
}

export async function kickPlayer(
  id: string,
  login: string,
  reason: string,
): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(id);
    await client.call("Kick", login, reason);
  });
}

// Status: (0: user selectable, 1: spectator, 2: player, 3: spectator but keep selectable)
export async function forceSpectator(
  id: string,
  login: string,
  status: number,
): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(id);
    await client.call("ForceSpectator", login, status);
  });
}

export async function connectFakePlayer(id: string): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(id);
    await client.call("ConnectFakePlayer");
  });
}

export async function syncPlayerList(client: GbxClient, id: string) {
  const playerList = await client.call("GetPlayerList", 1000, 0);
  if (!playerList || !Array.isArray(playerList)) {
    throw new Error("Failed to retrieve player list");
  }

  const players: PlayerInfo[] = [];
  for (const player of playerList) {
    try {
      players.push({
        nickName: player.NickName,
        login: player.Login,
        playerId: player.PlayerId,
        spectatorStatus: player.SpectatorStatus,
        teamId: player.TeamId,
      });
    } catch {
      players.push({
        nickName: "-",
        login: player.Login,
        playerId: 0,
        spectatorStatus: 0,
        teamId: 0,
      });
    }
  }

  const redis = await getRedisClient();
  const key = getKeyPlayers(id);

  await redis.set(key, JSON.stringify(players));
}
