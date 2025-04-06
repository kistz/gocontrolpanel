"use server";

import { DBRecord, Record } from "@/types/record";
import { collections, getDatabase } from "./mongodb";
import { ObjectId } from "mongodb";
import { auth } from "@/lib/auth";

export async function getAllRecords(): Promise<Record[]> {
  const db = await getDatabase();
  const collection = db.collection<DBRecord>(collections.RECORDS);
  const records = await collection.find().toArray();
  return records.map((record) => mapDBRecordToRecord(record));
}

export async function getRecordsPaginated(
  pagination: { skip: number; limit: number },
  sorting: { field: string; order: string },
): Promise<{ data: Record[]; totalCount: number }> {
  const db = await getDatabase();
  const collection = db.collection<DBRecord>(collections.RECORDS);
  const totalCount = await collection.countDocuments();
  const records = await collection
    .find()
    .skip(pagination.skip)
    .limit(pagination.limit)
    .sort({ [sorting.field]: sorting.order === "ASC" ? 1 : -1 })
    .toArray();
    
  return {
    data: records.map((record) => mapDBRecordToRecord(record)),
    totalCount,
  };
}

export async function deleteRecordById(recordId: ObjectId | string): Promise<void> {
  const session = await auth();
  if (!session) {
    throw new Error("Not authenticated");
  }

  if (!session.user.roles.includes("admin")) {
    throw new Error("Not authorized");
  }

  const db = await getDatabase();
  const collection = db.collection<DBRecord>(collections.RECORDS);
  const result = await collection.deleteOne({ _id: new ObjectId(recordId) });
  if (result.deletedCount === 0) {
    throw new Error(`Record not found`);
  }
}

function mapDBRecordToRecord(dbRecord: DBRecord): Record {
  return {
    ...dbRecord,
    _id: dbRecord._id.toString(),
  };
}