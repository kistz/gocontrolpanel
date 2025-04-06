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
    throw new Error(`Record with ID ${recordId} not found`);
  }
}

function mapDBRecordToRecord(dbRecord: DBRecord): Record {
  return {
    ...dbRecord,
    _id: dbRecord._id.toString(),
  };
}