import { getMapsInfo } from "@/lib/api/nadeo";
import { getClient } from "@/lib/dbclient";
import { Maps } from "@/lib/prisma/generated";
import { ServerError } from "@/types/responses";
import "server-only";

export async function createMap(
  map: Omit<
    Maps,
    | "id"
    | "submitter"
    | "timestamp"
    | "fileUrl"
    | "thumbnailUrl"
    | "uploadCheck"
    | "createdAt"
    | "updatedAt"
    | "deletedAt"
  >,
): Promise<Maps> {
  const db = getClient();

  const { data: mapsInfo, error } = await getMapsInfo([map.uid]);
  if (error) {
    throw new ServerError(
      `Failed to fetch map info for UID ${map.uid}: ${error}`,
    );
  }

  const info = mapsInfo.find((m) => m.mapUid === map.uid);
  if (!info) {
    throw new ServerError(`Map info not found for UID ${map.uid}`);
  }

  const newMap = await db.maps.create({
    data: {
      ...map,
      submitter: info.submitter,
      timestamp: info.timestamp,
      fileUrl: info.fileUrl,
      thumbnailUrl: info.thumbnailUrl,
      uploadCheck: new Date(),
    },
  });
  return newMap;
}

const MAP_INFO_UPDATE_THRESHOLD_HOURS = 72;
const BATCH_SIZE = 200;

export async function checkAndUpdateMapsInfoIfNeeded(
  maps: Maps[],
): Promise<Maps[]> {
  const db = getClient();

  const shouldUpdate = (map: Maps): boolean => {
    return (
      !map.thumbnailUrl &&
      (!map.uploadCheck ||
        map.uploadCheck.getTime() <
          Date.now() - MAP_INFO_UPDATE_THRESHOLD_HOURS * 60 * 60 * 1000)
    );
  };

  const mapsNeedingUpdate = maps.filter(shouldUpdate);

  if (mapsNeedingUpdate.length === 0) return maps;

  const updatedMaps: Maps[] = [];

  for (let i = 0; i < mapsNeedingUpdate.length; i += BATCH_SIZE) {
    const batch = mapsNeedingUpdate.slice(i, i + BATCH_SIZE);
    const uids = batch.map((m) => m.uid);
    const { data: apiMapsInfo } = await getMapsInfo(uids);

    for (const map of batch) {
      const apiInfo = apiMapsInfo.find((m) => m.mapUid === map.uid);

      if (!apiInfo) {
        await db.maps.update({
          where: { id: map.id },
          data: {
            uploadCheck: new Date(),
          },
        });
        updatedMaps.push(map);
        continue;
      }

      await db.maps.update({
        where: { id: map.id },
        data: {
          submitter: apiInfo.submitter,
          timestamp: apiInfo.timestamp,
          fileUrl: apiInfo.fileUrl,
          thumbnailUrl: apiInfo.thumbnailUrl,
          uploadCheck: new Date(),
        },
      });

      updatedMaps.push({
        ...map,
        submitter: apiInfo.submitter,
        timestamp: apiInfo.timestamp,
        fileUrl: apiInfo.fileUrl,
        thumbnailUrl: apiInfo.thumbnailUrl,
        uploadCheck: new Date(),
      });
    }
  }

  // Replace updated maps in the original list
  const updatedMapByUid = new Map(updatedMaps.map((m) => [m.uid, m]));

  return maps.map((map) => updatedMapByUid.get(map.uid) ?? map);
}

export async function syncAllMaps(): Promise<Maps[]> {
  const db = getClient();
  const maps = await db.maps.findMany({
    where: {
      deletedAt: null,
    },
  });

  return await checkAndUpdateMapsInfoIfNeeded(maps);
}

export async function getMapByUid(uid: string): Promise<Maps | null> {
  const db = getClient();
  const map = await db.maps.findFirst({
    where: { uid, deletedAt: null },
  });

  if (!map) {
    return null;
  }

  const [updatedMap] = await checkAndUpdateMapsInfoIfNeeded([map]);

  return updatedMap;
}
