"use server";
import { doServerActionWithAuth } from "@/lib/actions";
import { getGbxClient } from "@/lib/gbxclient";
import { ServerResponse } from "@/types/responses";
import { ModeScriptInfo } from "@/types/server";

export async function restartMap(serverUuid: string): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(serverUuid);
    await client.call("RestartMap");
  });
}

export async function nextMap(serverUuid: string): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(serverUuid);
    await client.call("NextMap");
  });
}

export async function balanceTeams(
  serverUuid: string,
): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(serverUuid);
    await client.call("AutoTeamBalance");
  });
}

export async function setShowOpponents(
  serverUuid: string,
  count: number,
): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(serverUuid);
    await client.call("SetForceShowAllOpponents", count);
  });
}

export async function getShowOpponents(serverUuid: string): Promise<
  ServerResponse<{
    CurrentValue: number;
    NextValue: number;
  }>
> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(serverUuid);
    return await client.call("GetForceShowAllOpponents");
  });
}

export async function setScriptName(
  serverUuid: string,
  script: string,
): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(serverUuid);
    await client.call("SetScriptName", script);
  });
}

export async function getScriptName(serverUuid: string): Promise<
  ServerResponse<{
    CurrentValue: string;
    NextValue: string;
  }>
> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(serverUuid);
    return await client.call("GetScriptName");
  });
}

export async function loadMatchSettings(
  serverUuid: string,
  filename: string,
): Promise<ServerResponse<number>> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(serverUuid);
    return await client.call("LoadMatchSettings", filename);
  });
}

export async function appendPlaylist(
  serverUuid: string,
  filename: string,
): Promise<ServerResponse<number>> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(serverUuid);
    return await client.call("AppendPlaylistFromMatchSettings", filename);
  });
}

export async function saveMatchSettings(
  serverUuid: string,
  filename: string,
): Promise<ServerResponse<number>> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(serverUuid);
    return await client.call("SaveMatchSettings", filename);
  });
}

export async function insertPlaylist(
  serverUuid: string,
  filename: string,
): Promise<ServerResponse<number>> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(serverUuid);
    return await client.call("InsertPlaylistFromMatchSettings", filename);
  });
}

export async function getModeScriptInfo(
  serverUuid: string,
): Promise<ServerResponse<ModeScriptInfo>> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(serverUuid);
    return await client.call("GetModeScriptInfo");
  });
}

export async function getModeScriptSettings(serverUuid: string): Promise<
  ServerResponse<{
    [key: string]: string | number | boolean;
  }>
> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(serverUuid);
    return await client.call("GetModeScriptSettings");
  });
}

export async function setModeScriptSettings(
  serverUuid: string,
  settings: {
    [key: string]: string | number | boolean;
  },
): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(serverUuid);
    await client.call("SetModeScriptSettings", settings);
    client.call("Echo", "", "UpdatedSettings");
  });
}

export async function triggerModeScriptEvent(
  serverUuid: string,
  method: string,
  param: string,
): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(serverUuid);
    await client.call("TriggerModeScriptEvent", method, param);
  });
}

export async function triggerModeScriptEventArray(
  serverUuid: string,
  method: string,
  params: string[],
): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(serverUuid);
    await client.call("TriggerModeScriptEventArray", method, params);
  });
}
