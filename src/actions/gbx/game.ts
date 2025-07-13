"use server";
import { doServerActionWithAuth } from "@/lib/actions";
import { getGbxClient } from "@/lib/gbxclient";
import { ServerResponse } from "@/types/responses";
import { ModeScriptInfo } from "@/types/server";

export async function restartMap(id: string): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(id);
    await client.call("RestartMap");
  });
}

export async function nextMap(id: string): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(id);
    await client.call("NextMap");
  });
}

export async function balanceTeams(id: string): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(id);
    await client.call("AutoTeamBalance");
  });
}

export async function setShowOpponents(
  id: string,
  count: number,
): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(id);
    await client.call("SetForceShowAllOpponents", count);
  });
}

export async function getShowOpponents(id: string): Promise<
  ServerResponse<{
    CurrentValue: number;
    NextValue: number;
  }>
> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(id);
    return await client.call("GetForceShowAllOpponents");
  });
}

export async function setScriptName(
  id: string,
  script: string,
): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(id);
    await client.call("SetScriptName", script);
  });
}

export async function getScriptName(id: string): Promise<
  ServerResponse<{
    CurrentValue: string;
    NextValue: string;
  }>
> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(id);
    return await client.call("GetScriptName");
  });
}

export async function loadMatchSettings(
  id: string,
  filename: string,
): Promise<ServerResponse<number>> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(id);
    return await client.call("LoadMatchSettings", filename);
  });
}

export async function appendPlaylist(
  id: string,
  filename: string,
): Promise<ServerResponse<number>> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(id);
    return await client.call("AppendPlaylistFromMatchSettings", filename);
  });
}

export async function saveMatchSettings(
  id: string,
  filename: string,
): Promise<ServerResponse<number>> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(id);
    return await client.call("SaveMatchSettings", filename);
  });
}

export async function insertPlaylist(
  id: string,
  filename: string,
): Promise<ServerResponse<number>> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(id);
    return await client.call("InsertPlaylistFromMatchSettings", filename);
  });
}

export async function getModeScriptInfo(
  id: string,
): Promise<ServerResponse<ModeScriptInfo>> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(id);
    return await client.call("GetModeScriptInfo");
  });
}

export async function getModeScriptSettings(id: string): Promise<
  ServerResponse<{
    [key: string]: string | number | boolean;
  }>
> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(id);
    return await client.call("GetModeScriptSettings");
  });
}

export async function setModeScriptSettings(
  id: string,
  settings: {
    [key: string]: string | number | boolean;
  },
): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(id);
    await client.call("SetModeScriptSettings", settings);
    client.call("Echo", "", "UpdatedSettings");
  });
}

export async function triggerModeScriptEvent(
  id: string,
  method: string,
  param: string,
): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(id);
    await client.call("TriggerModeScriptEvent", method, param);
  });
}

export async function triggerModeScriptEventArray(
  id: string,
  method: string,
  params: string[],
): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(id);
    await client.call("TriggerModeScriptEventArray", method, params);
  });
}
