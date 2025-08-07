"use server";

import { doServerActionWithAuth } from "@/lib/actions";
import { getClient } from "@/lib/dbclient";
import { Prisma } from "@/lib/prisma/generated";
import { ServerResponse } from "@/types/responses";

const pluginCommandsSchema = Prisma.validator<Prisma.PluginsInclude>()({
  commands: true,
});

export type PluginsWithCommands = Prisma.PluginsGetPayload<{
  include: typeof pluginCommandsSchema;
}>;

export async function getPlugins(): Promise<
  ServerResponse<PluginsWithCommands[]>
> {
  return doServerActionWithAuth(["servers::admin"], async () => {
    const db = getClient();
    return await db.plugins.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        commands: true,
      },
    });
  });
}
