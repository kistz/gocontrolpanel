"use server";
import { doServerActionWithAuth } from "@/lib/actions";
import { getGbxClient } from "@/lib/gbxclient";
import { ModeScriptInfo } from "@/types/gbx";
import { ServerResponse } from "@/types/responses";

export async function restartMap(serverId: string): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(serverId);
    await client.call("RestartMap");
  });
}

export async function nextMap(serverId: string): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(serverId);
    await client.call("NextMap");
  });
}

export async function balanceTeams(serverId: string): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(serverId);
    await client.call("AutoTeamBalance");
  });
}

export async function setShowOpponents(
  serverId: string,
  count: number,
): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(serverId);
    await client.call("SetForceShowAllOpponents", count);
  });
}

export async function getShowOpponents(serverId: string): Promise<
  ServerResponse<{
    CurrentValue: number;
    NextValue: number;
  }>
> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(serverId);
    return await client.call("GetForceShowAllOpponents");
  });
}

export async function setScriptName(
  serverId: string,
  script: string,
): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(serverId);
    await client.call("SetScriptName", script);
  });
}

export async function getScriptName(serverId: string): Promise<
  ServerResponse<{
    CurrentValue: string;
    NextValue: string;
  }>
> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(serverId);
    return await client.call("GetScriptName");
  });
}

export async function loadMatchSettings(
  serverId: string,
  filename: string,
): Promise<ServerResponse<number>> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(serverId);
    return await client.call("LoadMatchSettings", filename);
  });
}

export async function appendPlaylist(
  serverId: string,
  filename: string,
): Promise<ServerResponse<number>> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(serverId);
    return await client.call("AppendPlaylistFromMatchSettings", filename);
  });
}

export async function saveMatchSettings(
  serverId: string,
  filename: string,
): Promise<ServerResponse<number>> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(serverId);
    return await client.call("SaveMatchSettings", filename);
  });
}

export async function insertPlaylist(
  serverId: string,
  filename: string,
): Promise<ServerResponse<number>> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(serverId);
    return await client.call("InsertPlaylistFromMatchSettings", filename);
  });
}

export async function getModeScriptInfo(
  serverId: string,
): Promise<ServerResponse<ModeScriptInfo>> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(serverId);
    return await client.call("GetModeScriptInfo");
  });
}

export async function getModeScriptSettings(serverId: string): Promise<
  ServerResponse<{
    [key: string]: string | number | boolean;
  }>
> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(serverId);
    return await client.call("GetModeScriptSettings");
  });
}

export async function setModeScriptSettings(
  serverId: string,
  settings: {
    [key: string]: string | number | boolean;
  },
): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(serverId);
    await client.call("SetModeScriptSettings", settings);
    client.call("Echo", "", "UpdatedSettings");
  });
}

export async function triggerModeScriptEvent(
  serverId: string,
  method: string,
  param: string,
): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(serverId);
    await client.call("TriggerModeScriptEvent", method, param);
  });
}

export async function triggerModeScriptEventArray(
  serverId: string,
  method: string,
  params: string[],
): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(serverId);
    await client.call("TriggerModeScriptEventArray", method, params);
  });
}
