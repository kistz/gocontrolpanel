"use server";
import { doServerAction } from "@/lib/actions";
import { getClient } from "@/lib/dbclient";
import { Records } from "@/lib/prisma/generated";
import { ServerResponse } from "@/types/responses";

export async function getRecordsByMapUid(
  mapUid: string,
): Promise<ServerResponse<Records[]>> {
  return doServerAction(async () => {
    const db = getClient();
    const records = await db.records.findMany({
      where: { mapUid, deletedAt: null },
      orderBy: { time: "asc" },
    });

    return records;
  });
}

export async function getRecordsByLogin(
  login: string,
): Promise<ServerResponse<Records[]>> {
  return doServerAction(async () => {
    const db = getClient();
    const records = await db.records.findMany({
      where: { login, deletedAt: null },
      orderBy: { time: "asc" },
    });

    return records;
  });
}

export async function saveRecord(
  record: Omit<Records, "id" | "createdAt" | "updatedAt" | "deletedAt">,
): Promise<ServerResponse<Records>> {
  return doServerAction(async () => {
    const db = getClient();
    const existingRecord = await db.records.findFirst({
      where: { mapUid: record.mapUid, login: record.login, deletedAt: null },
    });

    if (existingRecord) {
      // Update existing record
      const updatedRecord = await db.records.update({
        where: { id: existingRecord.id },
        data: record,
      });
      return updatedRecord;
    } else {
      // Create new record
      const newRecord = await db.records.create({ data: record });
      return newRecord;
    }
  });
}
