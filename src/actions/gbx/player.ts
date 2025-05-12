"use server";

import { doServerActionWithAuth } from "@/lib/actions";
import { getGbxClient } from "@/lib/gbxclient";
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
