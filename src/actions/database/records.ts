import { getClient } from "@/lib/dbclient";
import { Records } from "@/lib/prisma/generated";
import "server-only";

export async function saveRecord(
  record: Omit<Records, "id" | "createdAt" | "updatedAt" | "deletedAt">,
): Promise<Records> {
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
}
