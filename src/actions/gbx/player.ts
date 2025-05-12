"use server";

import { doServerActionWithAuth } from "@/lib/actions";
import { getGbxClient } from "@/lib/gbxclient";
import { PlayerInfo } from "@/types/player";
import { ServerResponse } from "@/types/responses";

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

export async function getBlacklist(
  serverId: number,
): Promise<ServerResponse<PlayerInfo[]>> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(serverId);
    const blacklist = await client.call("GetBlackList", 1000, 0);

    const playerList: PlayerInfo[] = [];
    for (const player of blacklist) {
      const playerInfo = await client.call("GetPlayerInfo", player.Login);
      playerList.push({
        nickName: playerInfo.NickName,
        login: playerInfo.Login,
        playerId: playerInfo.PlayerId,
        spectatorStatus: playerInfo.SpectatorStatus,
        teamId: playerInfo.TeamId,
      });
    }

    return playerList;
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
      const playerInfo = await client.call("GetPlayerInfo", player.Login);
      playerList.push({
        nickName: playerInfo.NickName,
        login: playerInfo.Login,
        playerId: playerInfo.PlayerId,
        spectatorStatus: playerInfo.SpectatorStatus,
        teamId: playerInfo.TeamId,
      });
    }

    return playerList;
  });
}
