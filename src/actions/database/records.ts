import { getClient } from "@/lib/dbclient";
import { Maps } from "@/lib/prisma/generated";
import { getKeyActiveMap, getRedisClient } from "@/lib/redis";
import { Waypoint } from "@/types/gbx/waypoint";
import "server-only";
import { syncLogin } from "./gbx";

export async function saveMatchRecord(
  serverId: string,
  matchId: string | null,
  waypoint: Waypoint,
  round: number | null = null,
): Promise<void> {
  const redis = await getRedisClient();
  const key = getKeyActiveMap(serverId);

  const activeMap = await redis.get(key);
  if (!activeMap) {
    throw new Error(`No active map found for server ${serverId}`);
  }

  const mapData: Maps = JSON.parse(activeMap);
  if (!mapData) {
    throw new Error(`Map data is invalid for server ${serverId}`);
  }

  const db = getClient();

  const createRecord = async () => {
    if (matchId !== null && round !== null) {
      // Only upsert if both matchId and round are provided
      await db.records.upsert({
        where: {
          matchId_login_round: {
            login: waypoint.login,
            matchId,
            round,
          },
        },
        update: {
          mapId: mapData.id,
          mapUid: mapData.uid,
          time: waypoint.racetime,
          checkpoints: waypoint.curracecheckpoints || [],
        },
        create: {
          mapId: mapData.id,
          mapUid: mapData.uid,
          login: waypoint.login,
          time: waypoint.racetime,
          checkpoints: waypoint.curracecheckpoints || [],
          round,
          matchId,
        },
      });
    } else {
      // Otherwise, just create a new record
      await db.records.create({
        data: {
          mapId: mapData.id,
          mapUid: mapData.uid,
          login: waypoint.login,
          time: waypoint.racetime,
          checkpoints: waypoint.curracecheckpoints || [],
          round,
          matchId,
        },
      });
    }
  };

  try {
    await createRecord();
  } catch (error) {
    console.error("Error saving record:", error);

    try {
      await syncLogin(serverId, waypoint.login);
    } catch (syncError) {
      console.error("Error syncing login:", syncError);

      await db.users.create({
        data: { login: waypoint.login, nickName: waypoint.login, path: "" },
      });
    }
  } finally {
    await createRecord();
  }
}
