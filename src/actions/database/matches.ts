"use server";

import { doServerActionWithAuth } from "@/lib/actions";
import { getClient } from "@/lib/dbclient";
import { Prisma } from "@/lib/prisma/generated";
import { PaginationResponse, ServerResponse } from "@/types/responses";
import { PaginationState } from "@tanstack/react-table";

const matchesMapRecordsSchema = Prisma.validator<Prisma.MatchesInclude>()({
  map: true,
  records: {
    include: {
      user: true,
    },
  },
  _count: {
    select: {
      records: true,
    },
  },
});

export type MatchesWithMapAndRecords = Prisma.MatchesGetPayload<{
  include: typeof matchesMapRecordsSchema;
}>;

export async function getMatchesPaginated(
  pagination: PaginationState,
  sorting: { field: string; order: "asc" | "desc" },
  filter: string,
  fetchArgs?: {
    serverId: string;
  },
): Promise<ServerResponse<PaginationResponse<MatchesWithMapAndRecords>>> {
  if (!fetchArgs?.serverId) {
    throw new Error("Server ID is required to fetch matches.");
  }

  return doServerActionWithAuth(
    [
      `servers:${fetchArgs.serverId}:moderator`,
      `servers:${fetchArgs.serverId}:admin`,
    ],
    async () => {
      const db = getClient();

      const matches = await db.matches.findMany({
        skip: pagination.pageIndex * pagination.pageSize,
        take: pagination.pageSize,
        orderBy: { [sorting.field]: sorting.order },
        where: {
          deletedAt: null,
          serverId: fetchArgs.serverId,
          OR: [
            { mode: { contains: filter } },
            {
              map: {
                name: { contains: filter },
              },
            },
          ],
        },
        include: matchesMapRecordsSchema,
      });

      const totalCount = await db.matches.count({
        where: {
          deletedAt: null,
          serverId: fetchArgs.serverId,
          OR: [
            { mode: { contains: filter } },
            {
              map: {
                name: { contains: filter },
              },
            },
          ],
        },
      });

      return {
        data: matches,
        totalCount,
      };
    },
  );
}

export async function deleteMatch(
  serverId: string,
  matchId: string,
): Promise<ServerResponse<void>> {
  return doServerActionWithAuth([`servers:${serverId}:admin`], async () => {
    const db = getClient();

    await db.matches.update({
      where: { id: matchId },
      data: { deletedAt: new Date() },
    });
  });
}
