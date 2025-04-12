"use server";
import { getGbxClient } from "@/gbx/gbxclient";
import { withAuth } from "@/lib/auth";
import { ModeScriptInfo } from "@/types/server";

export async function restartMap(server: number): Promise<void> {
  await withAuth(["admin"]);

  const client = await getGbxClient(server);
  await client.call("RestartMap");
}

export async function nextMap(server: number): Promise<void> {
  await withAuth(["admin"]);

  const client = await getGbxClient(server);
  await client.call("NextMap");
}

export async function balanceTeams(server: number): Promise<void> {
  await withAuth(["admin"]);

  const client = await getGbxClient(server);
  await client.call("AutoTeamBalance");
}

export async function setShowOpponents(server: number, count: number): Promise<void> {
  await withAuth(["admin"]);

  const client = await getGbxClient(server);
  await client.call("SetForceShowAllOpponents", count);
}

export async function getShowOpponents(server: number): Promise<{
  CurrentValue: number;
  NextValue: number;
}> {
  await withAuth(["admin"]);

  const client = await getGbxClient(server);
  return await client.call("GetForceShowAllOpponents");
}

export async function setScriptName(server: number, script: string): Promise<void> {
  await withAuth(["admin"]);

  const client = await getGbxClient(server);
  await client.call("SetScriptName", script);
}

export async function getScriptName(server: number): Promise<{
  CurrentValue: string;
  NextValue: string;
}> {
  await withAuth(["admin"]);

  const client = await getGbxClient(server);
  return await client.call("GetScriptName");
}

export async function loadMatchSettings(server: number, filename: string): Promise<number> {
  await withAuth(["admin"]);

  const client = await getGbxClient(server);
  return await client.call("LoadMatchSettings", filename);
}

export async function appendPlaylist(server: number, filename: string): Promise<number> {
  await withAuth(["admin"]);

  const client = await getGbxClient(server);
  return await client.call("AppendPlaylistFromMatchSettings", filename);
}

export async function saveMatchSettings(server: number, filename: string): Promise<number> {
  await withAuth(["admin"]);

  const client = await getGbxClient(server);
  return await client.call("SaveMatchSettings", filename);
}

export async function insertPlaylist(server: number, filename: string): Promise<number> {
  await withAuth(["admin"]);

  const client = await getGbxClient(server);
  return await client.call("InsertPlaylistFromMatchSettings", filename);
}

export async function getModeScriptInfo(server: number): Promise<ModeScriptInfo> {
  await withAuth(["admin"]);

  const client = await getGbxClient(server);
  return await client.call("GetModeScriptInfo");
}

export async function getModeScriptSettings(server: number): Promise<{
  [key: string]: any;
}> {
  await withAuth(["admin"]);

  const client = await getGbxClient(server);
  return await client.call("GetModeScriptSettings");
}

export async function setModeScriptSettings(server: number, settings: {
  [key: string]: string | number | boolean;
}): Promise<void> {
  await withAuth(["admin"]);

  const client = await getGbxClient(server);
  await client.call("SetModeScriptSettings", settings);
}

export async function triggerModeScriptEvent(
  server: number,
  method: string,
  param: string,
): Promise<void> {
  await withAuth(["admin"]);

  const client = await getGbxClient(server);
  await client.call("TriggerModeScriptEvent", method, param);
}

export async function triggerModeScriptEventArray(
  server: number,
  method: string,
  params: string[],
): Promise<void> {
  await withAuth(["admin"]);

  const client = await getGbxClient(server);
  await client.call("TriggerModeScriptEventArray", method, params);
}
