"use server";
import { auth } from "@/lib/auth";
import { DBMap, Map } from "@/types/map";
import { ObjectId } from "mongodb";
import { collections, getDatabase } from "./mongodb";

export async function getAllMaps(): Promise<Map[]> {
  const db = await getDatabase();
  const collection = db.collection<DBMap>(collections.MAPS);
  const maps = await collection.find().toArray();
  return maps.map((map) => mapDBMapToMap(map));
}

export async function getMapCount(): Promise<number> {
  const db = await getDatabase();
  const collection = db.collection<DBMap>(collections.MAPS);
  return collection.countDocuments();
}

export async function getNewMapsCount(days: number): Promise<number> {
  const db = await getDatabase();
  const collection = db.collection<DBMap>(collections.MAPS);
  const date = new Date();
  date.setDate(date.getDate() - days);
  const count = await collection.countDocuments({
    createdAt: { $gte: date },
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

export async function deleteMapById(mapId: ObjectId | string): Promise<void> {
  const session = await auth();
  if (!session) {
    throw new Error("Not authenticated");
  }

  if (!session.user.roles.includes("admin")) {
    throw new Error("Not authorized");
  }

  const db = await getDatabase();
  const collection = db.collection<DBMap>(collections.MAPS);
  const result = await collection.deleteOne({ _id: new ObjectId(mapId) });
  if (result.deletedCount === 0) {
    throw new Error(`Map not found`);
  }
}

function mapDBMapToMap(dbMap: DBMap): Map {
  return {
    ...dbMap,
    _id: dbMap._id.toString(),
  };
}
