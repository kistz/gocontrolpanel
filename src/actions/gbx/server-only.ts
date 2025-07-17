import { GbxClientManager } from "@/lib/gbxclient";
import { getKeyPlayers, getRedisClient } from "@/lib/redis";
import { PlayerInfo } from "@/types/player";
import { GbxClient } from "@evotm/gbxclient";
import "server-only";

export async function syncPlayerList(
  manager: GbxClientManager,
  serverId: string,
) {
  const playerList = await manager.client.call("GetPlayerList", 1000, 0);
  if (!playerList || !Array.isArray(playerList)) {
    throw new Error("Failed to retrieve player list");
  }

  const mainServerInfo = await manager.client.call("GetMainServerPlayerInfo");

  const players: PlayerInfo[] = [];
  for (const player of playerList) {
    if (!player.Login || player.Login === mainServerInfo.Login) {
      continue; // Skip the main server player
    }

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

  manager.info.activePlayers = players;
  manager.emit("playerList", players);

  const redis = await getRedisClient();
  const key = getKeyPlayers(serverId);

  await redis.set(key, JSON.stringify(players));
}

export async function getPlayerInfo(
  client: GbxClient,
  login: string,
): Promise<PlayerInfo> {
  const playerInfo = await client.call("GetPlayerInfo", login);
  if (!playerInfo) {
    throw new Error(`Player with login ${login} not found`);
  }

  return {
    nickName: playerInfo.NickName,
    login: playerInfo.Login,
    playerId: playerInfo.PlayerId,
    spectatorStatus: playerInfo.SpectatorStatus,
    teamId: playerInfo.TeamId,
  };
}