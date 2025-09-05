import { getClient } from "@/lib/dbclient";
import "server-only";

export async function logAudit(
  userId: string,
  targetId: string,
  action: string,
  details: string,
): Promise<void> {
  const client = getClient();

  await client.auditLogs.create({
    data: {
      userId,
      action,
      targetType: action.split(".")[0],
      targetId,
      details,
    },
  });
}
