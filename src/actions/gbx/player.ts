"use server";

import { doServerActionWithAuth } from "@/lib/actions";
import { getGbxClient } from "@/lib/gbxclient";
import { PlayerInfo } from "@/types/player";
import { ServerResponse } from "@/types/responses";
import { logAudit } from "../database/server-only/audit-logs";

export async function getPlayerList(
  serverId: string,
): Promise<ServerResponse<PlayerInfo[]>> {
  return doServerActionWithAuth(
    [
      `servers:${serverId}:member`,
      `servers:${serverId}:moderator`,
      `servers:${serverId}:admin`,
      `group:servers:${serverId}:member`,
      `group:servers:${serverId}:moderator`,
      `group:servers:${serverId}:admin`,
    ],
    async () => {
      const client = await getGbxClient(serverId);
      const playerList = await client.call("GetPlayerList", 1000, 0);

      if (!playerList || !Array.isArray(playerList)) {
        return [];
      }

      const players: PlayerInfo[] = [];
      for (const player of playerList) {
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

      return players;
    },
  );
}

export async function banPlayer(
  serverId: string,
  login: string,
  reason: string,
): Promise<ServerResponse> {
  return doServerActionWithAuth(
    [
      `servers:${serverId}:moderator`,
      `servers:${serverId}:admin`,
      `group:servers:${serverId}:moderator`,
      `group:servers:${serverId}:admin`,
    ],
    async (session) => {
      const client = await getGbxClient(serverId);
      await client.call("Ban", login, reason);
      await logAudit(
        serverId,
        session.user.id,
        "server.players.banlist.add",
        { login, reason }
      );
    },
  );
}

export async function unbanPlayer(
  serverId: string,
  login: string,
): Promise<ServerResponse> {
  return doServerActionWithAuth(
    [
      `servers:${serverId}:moderator`,
      `servers:${serverId}:admin`,
      `group:servers:${serverId}:moderator`,
      `group:servers:${serverId}:admin`,
    ],
    async (session) => {
      const client = await getGbxClient(serverId);
      await client.call("UnBan", login);
      await logAudit(
        serverId,
        session.user.id,
        "server.players.banlist.remove",
        login
      );
    },
  );
}

export async function getBanList(
  serverId: string,
): Promise<ServerResponse<PlayerInfo[]>> {
  return doServerActionWithAuth(
    [
      `servers:${serverId}:moderator`,
      `servers:${serverId}:admin`,
      `group:servers:${serverId}:moderator`,
      `group:servers:${serverId}:admin`,
    ],
    async () => {
      const client = await getGbxClient(serverId);
      const banList = await client.call("GetBanList", 1000, 0);

      const playerList: PlayerInfo[] = [];
      for (const player of banList) {
        try {
          const playerInfo = await client.call("GetPlayerInfo", player.Login);
          playerList.push({
            nickName: playerInfo.NickName,
            login: playerInfo.Login,
            playerId: playerInfo.PlayerId,
            spectatorStatus: playerInfo.SpectatorStatus,
            teamId: playerInfo.TeamId,
          });
        } catch {
          playerList.push({
            nickName: "-",
            login: player.Login,
            playerId: 0,
            spectatorStatus: 0,
            teamId: 0,
          });
        }
      }

      return playerList;
    },
  );
}

export async function cleanBanList(serverId: string): Promise<ServerResponse> {
  return doServerActionWithAuth(
    [
      `servers:${serverId}:moderator`,
      `servers:${serverId}:admin`,
      `group:servers:${serverId}:moderator`,
      `group:servers:${serverId}:admin`,
    ],
    async (session) => {
      const client = await getGbxClient(serverId);
      await client.call("CleanBanList");
      await logAudit(
        serverId,
        session.user.id,
        "server.players.banlist.clear"
      );
    },
  );
}

export async function blacklistPlayer(
  serverId: string,
  login: string,
): Promise<ServerResponse> {
  return doServerActionWithAuth(
    [
      `servers:${serverId}:moderator`,
      `servers:${serverId}:admin`,
      `group:servers:${serverId}:moderator`,
      `group:servers:${serverId}:admin`,
    ],
    async (session) => {
      const client = await getGbxClient(serverId);
      await client.call("BlackList", login);
      await logAudit(
        serverId,
        session.user.id,
        "server.players.blacklist.add",
        login
      );
    },
  );
}

export async function unblacklistPlayer(
  serverId: string,
  login: string,
): Promise<ServerResponse> {
  return doServerActionWithAuth(
    [
      `servers:${serverId}:moderator`,
      `servers:${serverId}:admin`,
      `group:servers:${serverId}:moderator`,
      `group:servers:${serverId}:admin`,
    ],
    async (session) => {
      const client = await getGbxClient(serverId);
      await client.call("UnBlackList", login);
      await logAudit(
        serverId,
        session.user.id,
        "server.players.blacklist.remove",
        login
      );
    },
  );
}

export async function getBlacklist(
  serverId: string,
): Promise<ServerResponse<PlayerInfo[]>> {
  return doServerActionWithAuth(
    [
      `servers:${serverId}:moderator`,
      `servers:${serverId}:admin`,
      `group:servers:${serverId}:moderator`,
      `group:servers:${serverId}:admin`,
    ],
    async () => {
      const client = await getGbxClient(serverId);
      const blacklist = await client.call("GetBlackList", 1000, 0);

      const playerList: PlayerInfo[] = [];
      for (const player of blacklist) {
        try {
          const playerInfo = await client.call("GetPlayerInfo", player.Login);
          playerList.push({
            nickName: playerInfo.NickName,
            login: playerInfo.Login,
            playerId: playerInfo.PlayerId,
            spectatorStatus: playerInfo.SpectatorStatus,
            teamId: playerInfo.TeamId,
          });
        } catch {
          playerList.push({
            nickName: "-",
            login: player.Login,
            playerId: 0,
            spectatorStatus: 0,
            teamId: 0,
          });
        }
      }

      return playerList;
    },
  );
}

export async function loadBlacklist(
  serverId: string,
  filename: string,
): Promise<ServerResponse> {
  return doServerActionWithAuth(
    [
      `servers:${serverId}:moderator`,
      `servers:${serverId}:admin`,
      `group:servers:${serverId}:moderator`,
      `group:servers:${serverId}:admin`,
    ],
    async (session) => {
      const client = await getGbxClient(serverId);
      await client.call("LoadBlackList", filename);
      await logAudit(
        serverId,
        session.user.id,
        "server.players.blacklist.load",
        filename,
      );
    },
  );
}

export async function saveBlacklist(
  serverId: string,
  filename: string,
): Promise<ServerResponse> {
  return doServerActionWithAuth(
    [
      `servers:${serverId}:moderator`,
      `servers:${serverId}:admin`,
      `group:servers:${serverId}:moderator`,
      `group:servers:${serverId}:admin`,
    ],
    async (session) => {
      const client = await getGbxClient(serverId);
      await client.call("SaveBlackList", filename);
      await logAudit(
        serverId,
        session.user.id,
        "server.players.blacklist.save",
        filename,
      );
    },
  );
}

export async function cleanBlacklist(
  serverId: string,
): Promise<ServerResponse> {
  return doServerActionWithAuth(
    [
      `servers:${serverId}:moderator`,
      `servers:${serverId}:admin`,
      `group:servers:${serverId}:moderator`,
      `group:servers:${serverId}:admin`,
    ],
    async (session) => {
      const client = await getGbxClient(serverId);
      await client.call("CleanBlackList");
      await logAudit(
        serverId,
        session.user.id,
        "server.players.blacklist.clear"
      );
    },
  );
}

export async function addGuest(
  serverId: string,
  login: string,
): Promise<ServerResponse> {
  return doServerActionWithAuth(
    [
      `servers:${serverId}:moderator`,
      `servers:${serverId}:admin`,
      `group:servers:${serverId}:moderator`,
      `group:servers:${serverId}:admin`,
    ],
    async (session) => {
      const client = await getGbxClient(serverId);
      await client.call("AddGuest", login);
      await logAudit(
        serverId,
        session.user.id,
        "server.players.guestlist.add",
        login
      );
    },
  );
}

export async function removeGuest(
  serverId: string,
  login: string,
): Promise<ServerResponse> {
  return doServerActionWithAuth(
    [
      `servers:${serverId}:moderator`,
      `servers:${serverId}:admin`,
      `group:servers:${serverId}:moderator`,
      `group:servers:${serverId}:admin`,
    ],
    async (session) => {
      const client = await getGbxClient(serverId);
      await client.call("RemoveGuest", login);
      await logAudit(
        serverId,
        session.user.id,
        "server.players.guestlist.remove",
        login
      );
    },
  );
}

export async function getGuestlist(
  serverId: string,
): Promise<ServerResponse<PlayerInfo[]>> {
  return doServerActionWithAuth(
    [
      `servers:${serverId}:moderator`,
      `servers:${serverId}:admin`,
      `group:servers:${serverId}:moderator`,
      `group:servers:${serverId}:admin`,
    ],
    async () => {
      const client = await getGbxClient(serverId);
      const guestlist = await client.call("GetGuestList", 1000, 0);

      const playerList: PlayerInfo[] = [];
      for (const player of guestlist) {
        try {
          const playerInfo = await client.call("GetPlayerInfo", player.Login);
          playerList.push({
            nickName: playerInfo.NickName,
            login: playerInfo.Login,
            playerId: playerInfo.PlayerId,
            spectatorStatus: playerInfo.SpectatorStatus,
            teamId: playerInfo.TeamId,
          });
        } catch {
          playerList.push({
            nickName: "-",
            login: player.Login,
            playerId: 0,
            spectatorStatus: 0,
            teamId: 0,
          });
        }
      }

      return playerList;
    },
  );
}

export async function loadGuestlist(
  serverId: string,
  filename: string,
): Promise<ServerResponse> {
  return doServerActionWithAuth(
    [
      `servers:${serverId}:moderator`,
      `servers:${serverId}:admin`,
      `group:servers:${serverId}:moderator`,
      `group:servers:${serverId}:admin`,
    ],
    async (session) => {
      const client = await getGbxClient(serverId);
      await client.call("LoadGuestList", filename);
      await logAudit(
        serverId,
        session.user.id,
        "server.players.guestlist.load",
        filename,
      );
    },
  );
}

export async function saveGuestlist(
  serverId: string,
  filename: string,
): Promise<ServerResponse> {
  return doServerActionWithAuth(
    [
      `servers:${serverId}:moderator`,
      `servers:${serverId}:admin`,
      `group:servers:${serverId}:moderator`,
      `group:servers:${serverId}:admin`,
    ],
    async (session) => {
      const client = await getGbxClient(serverId);
      await client.call("SaveGuestList", filename);
      await logAudit(
        serverId,
        session.user.id,
        "server.players.guestlist.save",
        filename,
      );
    },
  );
}

export async function cleanGuestlist(
  serverId: string,
): Promise<ServerResponse> {
  return doServerActionWithAuth(
    [
      `servers:${serverId}:moderator`,
      `servers:${serverId}:admin`,
      `group:servers:${serverId}:moderator`,
      `group:servers:${serverId}:admin`,
    ],
    async (session) => {
      const client = await getGbxClient(serverId);
      await client.call("CleanGuestList");
      await logAudit(
        serverId,
        session.user.id,
        "server.players.guestlist.clear"
      );
    },
  );
}

export async function kickPlayer(
  serverId: string,
  login: string,
  reason: string,
): Promise<ServerResponse> {
  return doServerActionWithAuth(
    [
      `servers:${serverId}:moderator`,
      `servers:${serverId}:admin`,
      `group:servers:${serverId}:moderator`,
      `group:servers:${serverId}:admin`,
    ],
    async (session) => {
      const client = await getGbxClient(serverId);
      await client.call("Kick", login, reason);
      await logAudit(
        serverId,
        session.user.id,
        "server.players.kick",
        { login, reason }
      );
    },
  );
}

// Status: (0: user selectable, 1: spectator, 2: player, 3: spectator but keep selectable)
export async function forceSpectator(
  serverId: string,
  login: string,
  status: number,
): Promise<ServerResponse> {
  return doServerActionWithAuth(
    [
      `servers:${serverId}:moderator`,
      `servers:${serverId}:admin`,
      `group:servers:${serverId}:moderator`,
      `group:servers:${serverId}:admin`,
    ],
    async (session) => {
      const client = await getGbxClient(serverId);
      await client.call("ForceSpectator", login, status);
      await logAudit(
        serverId,
        session.user.id,
        "server.players.spectator.set",
        { login, status }
      );
    },
  );
}

export async function connectFakePlayer(
  serverId: string,
): Promise<ServerResponse> {
  return doServerActionWithAuth(
    [`servers:${serverId}:admin`, `group:servers:${serverId}:admin`],
    async () => {
      const client = await getGbxClient(serverId);
      await client.call("ConnectFakePlayer");
    },
  );
}
