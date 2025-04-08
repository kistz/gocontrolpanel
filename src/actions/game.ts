"use server";

import { getGbxClient } from "@/gbx/gbxclient";
import { withAuth } from "@/lib/auth";
import { ModeScriptInfo } from "@/types/server";

export default async function restartMap(): Promise<void> {
  await withAuth(["admin"]);

  const client = await getGbxClient();
  await client.call("RestartMap");
}

export async function nextMap(): Promise<void> {
  await withAuth(["admin"]);

  const client = await getGbxClient();
  await client.call("NextMap");
}

export async function balanceTeams(): Promise<void> {
  await withAuth(["admin"]);

  const client = await getGbxClient();
  await client.call("AutoTeamBalance");
}

export async function setShowOpponents(count: number): Promise<void> {
  await withAuth(["admin"]);

  const client = await getGbxClient();
  await client.call("SetForceShowAllOpponents", count);
}

export async function getShowOpponents(): Promise<{
  CurrentValue: number;
  NextValue: number;
}> {
  await withAuth(["admin"]);

  const client = await getGbxClient();
  return await client.call("GetForceShowAllOpponents");
}

export async function setScriptName(name: string): Promise<void> {
  await withAuth(["admin"]);

  const client = await getGbxClient();
  await client.call("SetScriptName", name);
}

export async function getScriptName(): Promise<{
  CurrentValue: string;
  NextValue: string;
}> {
  await withAuth(["admin"]);

  const client = await getGbxClient();
  return await client.call("GetScriptName");
}

export async function loadMatchSettings(filename: string): Promise<number> {
  await withAuth(["admin"]);

  const client = await getGbxClient();
  return await client.call("LoadMatchSettings", filename);
}

export async function appendPlaylist(filename: string): Promise<number> {
  await withAuth(["admin"]);

  const client = await getGbxClient();
  return await client.call("AppendPlaylistFromMatchSettings", filename);
}

export async function saveMatchSettings(filename: string): Promise<number> {
  await withAuth(["admin"]);

  const client = await getGbxClient();
  return await client.call("SaveMatchSettings", filename);
}

export async function insertPlaylist(filename: string): Promise<number> {
  await withAuth(["admin"]);

  const client = await getGbxClient();
  return await client.call("InsertPlaylistFromMatchSettings", filename);
}

export async function getModeScriptInfo(): Promise<ModeScriptInfo> {
  await withAuth(["admin"]);

  const client = await getGbxClient();
  return await client.call("GetModeScriptInfo");
}

export async function getModeScriptSettings(): Promise<{
  [key: string]: any;
}> {
  await withAuth(["admin"]);

  const client = await getGbxClient();
  return await client.call("GetModeScriptSettings");
}

export async function setModeScriptSettings(settings: {
  [key: string]: any;
}): Promise<void> {
  await withAuth(["admin"]);

  const client = await getGbxClient();
  await client.call("SetModeScriptSettings", settings);
}

export async function triggerModeScriptEvent(
  method: string,
  param: string,
): Promise<void> {
  await withAuth(["admin"]);

  const client = await getGbxClient();
  await client.call("TriggerModeScriptEvent", method, param);
}

export async function triggerModeScriptEventArray(
  method: string,
  params: string[],
): Promise<void> {
  await withAuth(["admin"]);

  const client = await getGbxClient();
  await client.call("TriggerModeScriptEventArray", method, params);
}
