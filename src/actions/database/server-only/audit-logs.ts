import { getClient } from "@/lib/dbclient";
import { InputJsonValue } from "@/lib/prisma/generated/runtime/library";
import "server-only";

export async function logAudit(
  userId: string,
  targetId: string,
  action: string,
  details?: InputJsonValue,
  error?: string,
): Promise<void> {
  const db = getClient();

  await db.auditLogs.create({
    data: {
      userId,
      action,
      targetType: action.split(".")[0],
      targetId,
      details,
      error,
    },
  });
}
