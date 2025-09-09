"use server";

import { doServerActionWithAuth } from "@/lib/actions";
import { getClient } from "@/lib/dbclient";
import { Commands } from "@/lib/prisma/generated";
import { ServerResponse } from "@/types/responses";

export async function getCommands(): Promise<ServerResponse<Commands[]>> {
  return doServerActionWithAuth(
    ["servers::admin", "group:servers::admin"],
    async () => {
      const db = getClient();
      return await db.commands.findMany({
        where: {
          deletedAt: null,
        },
      });
    },
  );
}
