"use server";

import { doServerActionWithAuth } from "@/lib/actions";
import { getGbxClient } from "@/lib/gbxclient";
import { PlayerInfo } from "@/types/player";
import { ServerResponse } from "@/types/responses";

export async function getPlayerList(
  serverId: number,
): Promise<ServerResponse<PlayerInfo[]>> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(serverId);
    const playerList = await client.call("GetPlayerList", 1000, 0);

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
  serverId: number,
  login: string,
  reason: string,
): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(serverId);
    await client.call("Ban", login, reason);
  });
}

export async function unbanPlayer(
  serverId: number,
  login: string,
): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(serverId);
    await client.call("UnBan", login);
  });
}

export async function getBanList(
  serverId: number,
): Promise<ServerResponse<PlayerInfo[]>> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(serverId);
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

export async function cleanBanList(serverId: number): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(serverId);
    await client.call("CleanBanList");
  });
}

export async function blacklistPlayer(
  serverId: number,
  login: string,
): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(serverId);
    await client.call("BlackList", login);
  });
}

export async function unblacklistPlayer(
  serverId: number,
  login: string,
): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(serverId);
    await client.call("UnBlackList", login);
  });
}

export async function getBlacklist(
  serverId: number,
): Promise<ServerResponse<PlayerInfo[]>> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(serverId);
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
  serverId: number,
  filename: string,
): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(serverId);
    await client.call("LoadBlackList", filename);
  });
}

export async function saveBlacklist(
  serverId: number,
  filename: string,
): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(serverId);
    await client.call("SaveBlackList", filename);
  });
}

export async function cleanBlacklist(
  serverId: number,
): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(serverId);
    await client.call("CleanBlackList");
  });
}

export async function addGuest(
  serverId: number,
  login: string,
): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(serverId);
    await client.call("AddGuest", login);
  });
}

export async function removeGuest(
  serverId: number,
  login: string,
): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(serverId);
    await client.call("RemoveGuest", login);
  });
}

export async function getGuestlist(
  serverId: number,
): Promise<ServerResponse<PlayerInfo[]>> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(serverId);
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
  serverId: number,
  filename: string,
): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(serverId);
    await client.call("LoadGuestList", filename);
  });
}

export async function saveGuestlist(
  serverId: number,
  filename: string,
): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(serverId);
    await client.call("SaveGuestList", filename);
  });
}

export async function cleanGuestlist(
  serverId: number,
): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(serverId);
    await client.call("CleanGuestList");
  });
}

export async function kickPlayer(
  serverId: number,
  login: string,
  reason: string,
): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(serverId);
    await client.call("Kick", login, reason);
  });
}

// Status: (0: user selectable, 1: spectator, 2: player, 3: spectator but keep selectable)
export async function forceSpectator(
  serverId: number,
  login: string,
  status: number,
): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(serverId);
    await client.call("ForceSpectator", login, status);
  });
}
