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
    },
  });
  return newMap;
}
