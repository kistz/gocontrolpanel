"use server";

import { getGbxClient } from "@/lib/gbxclient";
import { getKeyPlayers, getRedisClient } from "@/lib/redis";
import { PlayerInfo } from "@/types/player";

export async function onPlayerConnect(id: string, login: string) {
  const client = await getGbxClient(id);
  const playerData = await client.call("GetPlayerInfo", login);
  if (!playerData) {
    throw new Error(`Player data not found for login: ${login}`);
  }

  const player: PlayerInfo = {
    nickName: playerData.NickName,
    login: playerData.Login,
    playerId: playerData.PlayerId,
    spectatorStatus: playerData.SpectatorStatus,
    teamId: playerData.TeamId,
  };

  const redis = await getRedisClient();
  const key = getKeyPlayers(id);

  const players = await redis.get(key);
  const playerList: PlayerInfo[] = players ? JSON.parse(players) : [];

  const existingPlayer = playerList.find((p) => p.login === login);

  if (existingPlayer) {
    Object.assign(existingPlayer, player);
  } else {
    playerList.push(player);
  }

  await redis.set(key, JSON.stringify(playerList));
}

export async function onPlayerDisconnect(id: string, login: string) {
  const redis = await getRedisClient();
  const key = getKeyPlayers(id);

  const playersData = await redis.get(key);
  if (!playersData) {
    throw new Error(`No players found for server ${id}`);
  }

  const playerList: PlayerInfo[] = JSON.parse(playersData);
  const updatedList = playerList.filter((player) => player.login !== login);

  await redis.set(key, JSON.stringify(updatedList));
}
