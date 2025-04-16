"use server";

import { withAuth } from "@/lib/auth";
import { DBRecord, Record } from "@/types/record";
import { ObjectId } from "mongodb";
import { collections, getDatabase } from "./mongodb";

export async function getAllRecords(): Promise<Record[]> {
  const db = await getDatabase();
  const collection = db.collection<DBRecord>(collections.RECORDS);
  const records = await collection
    .find({
      deletedAt: { $exists: false },
    })
    .toArray();
  return records.map((record) => mapDBRecordToRecord(record));
}

export async function getRecordCount(): Promise<number> {
  const db = await getDatabase();
  const collection = db.collection<DBRecord>(collections.RECORDS);
  return collection.countDocuments({
    deletedAt: { $exists: false },
  });
}

export async function getNewRecordsCount(days: number): Promise<number> {
  const db = await getDatabase();
  const collection = db.collection<DBRecord>(collections.RECORDS);
  const date = new Date();
  date.setDate(date.getDate() - days);
  const count = await collection.countDocuments({
    createdAt: { $gte: date },
    deletedAt: { $exists: false },
  });
  return count;
}

export async function getRecordCountPerDay(days: number): Promise<
  {
    date: Date;
    count: number;
  }[]
> {
  const db = await getDatabase();
  const collection = db.collection<DBRecord>(collections.RECORDS);
  const date = new Date();
  date.setDate(date.getDate() - days);
  const records = await collection
    .aggregate([
      {
        $match: {
          createdAt: { $gte: date },
          deletedAt: { $exists: false },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
    ])
    .sort({ createdAt: -1 })
    .toArray();

  return records.map((record) => ({
    date: new Date(record._id),
    count: record.count,
  }));
}

export async function getRecordsPaginated(
  pagination: { skip: number; limit: number },
  sorting: { field: string; order: string },
): Promise<{ data: Record[]; totalCount: number }> {
  const db = await getDatabase();
  const collection = db.collection<DBRecord>(collections.RECORDS);
  const totalCount = await collection.countDocuments();
  const records = await collection
    .find({
      deletedAt: { $exists: false },
    })
    .skip(pagination.skip)
    .limit(pagination.limit)
    .sort({ [sorting.field]: sorting.order === "ASC" ? 1 : -1 })
    .toArray();

  return {
    data: records.map((record) => mapDBRecordToRecord(record)),
    totalCount,
  };
}

export async function deleteRecordById(
  recordId: ObjectId | string,
): Promise<void> {
  await withAuth(["admin"]);

  const db = await getDatabase();
  const collection = db.collection<DBRecord>(collections.RECORDS);
  const result = await collection.updateOne(
    { _id: new ObjectId(recordId) },
    { $set: { deletedAt: new Date() } },
  );
  if (result.modifiedCount === 0) {
    throw new Error(`Record not found`);
  }
}

function mapDBRecordToRecord(dbRecord: DBRecord): Record {
  return {
    ...dbRecord,
    _id: dbRecord._id.toString(),
  };
}
