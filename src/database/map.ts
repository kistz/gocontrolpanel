"use server";

import { Map } from "@/types/map";
import { collections, getDatabase } from "./mongodb";

export async function getAllMaps(): Promise<Map[]> {
  const db = await getDatabase();
  const collection = db.collection<Map>(collections.MAPS);
  const maps = await collection.find().toArray();
  return maps.map((map) => mapDBMapToMap(map));
}

export async function getMapsPaginated(
  pagination: { skip: number; limit: number },
  sorting: { field: string; order: string },
): Promise<{ data: Map[]; totalCount: number }> {
  const db = await getDatabase();
  const collection = db.collection<Map>(collections.MAPS);
  const totalCount = await collection.countDocuments();
  const maps = await collection
    .find()
    .skip(pagination.skip)
    .limit(pagination.limit)
    .sort({ [sorting.field]: sorting.order === "ASC" ? 1 : -1 })
    .toArray();

  return {
    data: maps.map((map) => mapDBMapToMap(map)),
    totalCount,
  };
}

function mapDBMapToMap(dbMap: Map): Map {
  return {
    ...dbMap,
    _id: dbMap._id.toString(),
  };
}
