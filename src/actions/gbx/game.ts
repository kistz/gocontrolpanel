"use server";
import { doServerActionWithAuth } from "@/lib/actions";
import { getGbxClient } from "@/lib/gbxclient";
import { ServerResponse } from "@/types/responses";
import { ModeScriptInfo } from "@/types/server";

export async function restartMap(server: number): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(server);
    await client.call("RestartMap");
  });
}

export async function nextMap(server: number): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(server);
    await client.call("NextMap");
  });
}

export async function balanceTeams(server: number): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(server);
    await client.call("AutoTeamBalance");
  });
}

export async function setShowOpponents(
  server: number,
  count: number,
): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(server);
    await client.call("SetForceShowAllOpponents", count);
  });
}

export async function getShowOpponents(server: number): Promise<
  ServerResponse<{
    CurrentValue: number;
    NextValue: number;
  }>
> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(server);
    return await client.call("GetForceShowAllOpponents");
  });
}

export async function setScriptName(
  server: number,
  script: string,
): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(server);
    await client.call("SetScriptName", script);
  });
}

export async function getScriptName(server: number): Promise<
  ServerResponse<{
    CurrentValue: string;
    NextValue: string;
  }>
> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(server);
    return await client.call("GetScriptName");
  });
}

export async function loadMatchSettings(
  server: number,
  filename: string,
): Promise<ServerResponse<Number>> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(server);
    return await client.call("LoadMatchSettings", filename);
  });
}

export async function appendPlaylist(
  server: number,
  filename: string,
): Promise<ServerResponse<number>> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(server);
    return await client.call("AppendPlaylistFromMatchSettings", filename);
  });
}

export async function saveMatchSettings(
  server: number,
  filename: string,
): Promise<ServerResponse<number>> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(server);
    return await client.call("SaveMatchSettings", filename);
  });
}

export async function insertPlaylist(
  server: number,
  filename: string,
): Promise<ServerResponse<number>> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(server);
    return await client.call("InsertPlaylistFromMatchSettings", filename);
  });
}

export async function getModeScriptInfo(
  server: number,
): Promise<ServerResponse<ModeScriptInfo>> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(server);
    return await client.call("GetModeScriptInfo");
  });
}

export async function getModeScriptSettings(server: number): Promise<
  ServerResponse<{
    [key: string]: any;
  }>
> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(server);
    return await client.call("GetModeScriptSettings");
  });
}

export async function setModeScriptSettings(
  server: number,
  settings: {
    [key: string]: string | number | boolean;
  },
): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(server);
    await client.call("SetModeScriptSettings", settings);
  });
}

export async function triggerModeScriptEvent(
  server: number,
  method: string,
  param: string,
): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(server);
    await client.call("TriggerModeScriptEvent", method, param);
  });
}

export async function triggerModeScriptEventArray(
  server: number,
  method: string,
  params: string[],
): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(server);
    await client.call("TriggerModeScriptEventArray", method, params);
  });
}
