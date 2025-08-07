"use server";

import { doServerActionWithAuth } from "@/lib/actions";
import { searchTMXMaps } from "@/lib/api/tmx";
import { TMXMapSearch } from "@/types/api/tmx";
import { ServerResponse } from "@/types/responses";

export async function searchMaps(
  serverId: string,
  queryParams: Record<string, string>,
  after?: number,
): Promise<ServerResponse<TMXMapSearch>> {
  return doServerActionWithAuth(
    [`servers:${serverId}:moderator`, `servers:${serverId}:admin`],
    async () => {
      return searchTMXMaps(
        {
          ...queryParams,
          ...(after ? { after: after.toString() } : {}),
        },
        12,
      );
    },
  );
}
