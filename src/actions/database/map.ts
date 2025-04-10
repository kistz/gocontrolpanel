"use server";
import { getGbxClient } from "@/gbx/gbxclient";
import { withAuth } from "@/lib/auth";
import { DBMap, Map } from "@/types/map";
import { ObjectId } from "mongodb";
import { collections, getDatabase } from "./mongodb";

export async function getAllMaps(): Promise<Map[]> {
  const db = await getDatabase();
  const collection = db.collection<DBMap>(collections.MAPS);
  const maps = await collection
    .find({
      deletedAt: { $exists: false },
    })
    .toArray();
  return maps.map((map) => mapDBMapToMap(map));
}

export async function getMapCount(): Promise<number> {
  const db = await getDatabase();
  const collection = db.collection<DBMap>(collections.MAPS);
  return collection.countDocuments({
    deletedAt: { $exists: false },
  });
}

export async function getNewMapsCount(days: number): Promise<number> {
  const db = await getDatabase();
  const collection = db.collection<DBMap>(collections.MAPS);
  const date = new Date();
  date.setDate(date.getDate() - days);
  const count = await collection.countDocuments({
    createdAt: { $gte: date },
    deletedAt: { $exists: false },
  });
  return count;
}

export async function getMapsPaginated(
  pagination: { skip: number; limit: number },
  sorting: { field: string; order: string },
): Promise<{ data: Map[]; totalCount: number }> {
  const db = await getDatabase();
  const collection = db.collection<DBMap>(collections.MAPS);
  const totalCount = await collection.countDocuments();
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
}

export async function deleteMapById(mapId: ObjectId | string): Promise<void> {
  await withAuth(["admin"]);

  const db = await getDatabase();
  const collection = db.collection<DBMap>(collections.MAPS);
  const result = await collection.updateOne(
    { _id: new ObjectId(mapId) },
    { $set: { deletedAt: new Date() } },
  );
  if (result.modifiedCount === 0) {
    throw new Error(`Map not found`);
  }
}

function mapDBMapToMap(dbMap: DBMap): Map {
  return {
    ...dbMap,
    _id: dbMap._id.toString(),
  };
}

export async function getMapList(
  count: number = 100,
  start: number = 0,
): Promise<Map[]> {
  await withAuth(["admin"]);

  const client = await getGbxClient();
  const mapList = await client.call("GetMapList", count, start);
  if (!mapList) {
    throw new Error("Failed to get map list");
  }

  let uids: string[] = [];
  mapList.forEach((map: any) => {
    if (map.UId) {
      uids.push(map.UId);
    }
  });

  const db = await getDatabase();
  const collection = db.collection<DBMap>(collections.MAPS);
  const maps = await collection.find({ uid: { $in: uids } }).toArray();

  const orderedMaps = mapList
    .map((map: any) => {
      const foundMap = maps.find((m) => m.uid === map.UId);
      if (foundMap) {
        return mapDBMapToMap(foundMap);
      }
      return null;
    })
    .filter((map: Map) => map !== null);

  return orderedMaps as Map[];
}
