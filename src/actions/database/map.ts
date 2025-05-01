"use server";
import { doServerAction, doServerActionWithAuth } from "@/lib/actions";
import { getMapsInfo } from "@/lib/api/nadeo";
import { getGbxClient } from "@/lib/gbxclient";
import { DBMap, Map, MapInfo, MapInfoMinimal } from "@/types/map";
import {
  PaginationResponse,
  ServerError,
  ServerResponse,
} from "@/types/responses";
import { ObjectId } from "mongodb";
import { collections, getDatabase } from "../../lib/mongodb";

export async function getAllMaps(): Promise<ServerResponse<Map[]>> {
  return doServerAction(async () => {
    const db = await getDatabase();
    const collection = db.collection<DBMap>(collections.MAPS);
    const maps = await collection
      .find({
        deletedAt: { $exists: false },
      })
      .toArray();

    const mapsMissingApiInfo = maps.filter((map) => !map.thumbnailUrl);
    if (mapsMissingApiInfo.length > 0) {
      const mapUids = mapsMissingApiInfo.map((map) => map.uid);
      const BATCH_SIZE = 200;

      for (let i = 0; i < mapUids.length; i += BATCH_SIZE) {
        const batch = mapUids.slice(i, i + BATCH_SIZE);
        const { data: apiMapsInfo } = await getMapsInfo(batch);

        for (const map of mapsMissingApiInfo) {
          const mapInfoFromApi = apiMapsInfo.find((m) => m.mapUid === map.uid);
          if (mapInfoFromApi) {
            await collection.updateOne(
              { _id: map._id },
              {
                $set: {
                  submitter: mapInfoFromApi.submitter,
                  timestamp: mapInfoFromApi.timestamp,
                  fileUrl: mapInfoFromApi.fileUrl,
                  thumbnailUrl: mapInfoFromApi.thumbnailUrl,
                },
              },
            );
          }
        }
      }
    }

    return maps.map((map) => mapDBMapToMap(map));
  });
}

export async function getMapCount(): Promise<ServerResponse<number>> {
  return doServerAction(async () => {
    const db = await getDatabase();
    const collection = db.collection<DBMap>(collections.MAPS);
    const count = await collection.countDocuments({
      deletedAt: { $exists: false },
    });
    return count;
  });
}

export async function getNewMapsCount(
  days: number,
): Promise<ServerResponse<number>> {
  return doServerAction(async () => {
    const db = await getDatabase();
    const collection = db.collection<DBMap>(collections.MAPS);
    const date = new Date();
    date.setDate(date.getDate() - days);
    const count = await collection.countDocuments({
      createdAt: { $gte: date },
      deletedAt: { $exists: false },
    });
    return count;
  });
}

export async function getMapsPaginated(
  pagination: { skip: number; limit: number },
  sorting: { field: string; order: string },
): Promise<ServerResponse<PaginationResponse<Map>>> {
  return doServerAction(async () => {
    const db = await getDatabase();
    const collection = db.collection<DBMap>(collections.MAPS);
    const totalCount = await collection.countDocuments({
      deletedAt: { $exists: false },
    });
    const maps = await collection
      .find({
        deletedAt: { $exists: false },
      })
      .skip(pagination.skip)
      .limit(pagination.limit)
      .sort({ [sorting.field]: sorting.order === "ASC" ? 1 : -1 })
      .toArray();

    return {
      data: maps.map((map) => mapDBMapToMap(map)),
      totalCount,
    };
  });
}

export async function deleteMapById(
  mapId: ObjectId | string,
): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const db = await getDatabase();
    const collection = db.collection<DBMap>(collections.MAPS);
    const result = await collection.updateOne(
      { _id: new ObjectId(mapId) },
      { $set: { deletedAt: new Date() } },
    );

    if (result.matchedCount === 0) {
      throw new ServerError(`Map not found`);
    }
  });
}

function mapDBMapToMap(dbMap: DBMap): Map {
  return {
    ...dbMap,
    _id: dbMap._id.toString(),
  };
}

export async function getMapList(
  server: number,
  count: number = 100,
  start: number = 0,
): Promise<ServerResponse<Map[]>> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(server);
    const mapList: MapInfoMinimal[] = await client.call(
      "GetMapList",
      count,
      start,
    );

    if (!mapList) {
      throw new ServerError("Failed to get map list");
    }

    const uids = mapList
      .filter((map: any) => map.UId)
      .map((map: any) => map.UId);

    const db = await getDatabase();
    const collection = db.collection<DBMap>(collections.MAPS);

    const existingMaps = await collection
      .find({ uid: { $in: uids } })
      .toArray();
    const existingUids = new Set(existingMaps.map((m) => m.uid));

    const missingMaps = mapList.filter(
      (map: any) => !existingUids.has(map.UId),
    );

    if (missingMaps.length > 0) {
      const { data: apiMapsInfo } = await getMapsInfo(
        missingMaps.map((map: any) => map.UId),
      );

      const now = new Date();

      const newDbMaps: DBMap[] = [];
      for (const map of missingMaps) {
        const mapInfo: MapInfo = await client.call("GetMapInfo", map.FileName);
        const mapInfoFromApi = apiMapsInfo.find((m) => m.mapUid === map.UId);

        newDbMaps.push({
          _id: new ObjectId(),
          name: mapInfo.Name || "Unknown",
          uid: mapInfo.UId,
          fileName: mapInfo.FileName || "",
          author: mapInfo.Author || "",
          authorNickname: mapInfo.AuthorNickname || "",
          authorTime: mapInfo.AuthorTime || 0,
          goldTime: mapInfo.GoldTime || 0,
          silverTime: mapInfo.SilverTime || 0,
          bronzeTime: mapInfo.BronzeTime || 0,
          submitter: mapInfoFromApi?.submitter || "",
          timestamp: mapInfoFromApi?.timestamp || new Date(),
          fileUrl: mapInfoFromApi?.fileUrl || "",
          thumbnailUrl: mapInfoFromApi?.thumbnailUrl || "",
          createdAt: now,
          updatedAt: now,
        });
      }

      await collection.insertMany(newDbMaps);
      existingMaps.push(...newDbMaps);
    }

    const orderedMaps = mapList
      .map((map: any) => {
        const foundMap = existingMaps.find((m) => m.uid === map.UId);
        return foundMap ? mapDBMapToMap(foundMap) : null;
      })
      .filter((map: Map | null): map is Map => map !== null);

    return orderedMaps;
  });
}
