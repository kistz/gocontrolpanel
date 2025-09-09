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
      user: {
        select: {
          nickName: true,
        },
      },
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const recordsUsersSchema = Prisma.validator<Prisma.RecordsInclude>()({
  user: {
    select: {
      nickName: true,
    },
  },
});

export type RecordsWithUser = Prisma.RecordsGetPayload<{
  include: typeof recordsUsersSchema;
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
      `servers:${fetchArgs.serverId}:member`,
      `servers:${fetchArgs.serverId}:moderator`,
      `servers:${fetchArgs.serverId}:admin`,
      `group:servers:${fetchArgs.serverId}:member`,
      `group:servers:${fetchArgs.serverId}:moderator`,
      `group:servers:${fetchArgs.serverId}:admin`,
    ],
    async () => {
      const db = getClient();

      const where = {
        deletedAt: null,
        serverId: fetchArgs.serverId,
        records: {
          some: {
            time: { not: -1 },
          },
        },
        OR: [
          { mode: { contains: filter } },
          {
            map: {
              name: { contains: filter },
            },
          },
        ],
      };

      const matches = await db.matches.findMany({
        skip: pagination.pageIndex * pagination.pageSize,
        take: pagination.pageSize,
        orderBy: { [sorting.field]: sorting.order },
        where,
        include: matchesMapRecordsSchema,
      });

      const totalCount = await db.matches.count({
        where,
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
  return doServerActionWithAuth(
    [
      `servers:${serverId}:moderator`,
      `servers:${serverId}:admin`,
      `group:servers:${serverId}:moderator`,
      `group:servers:${serverId}:admin`,
    ],
    async () => {
      const db = getClient();

      await db.matches.update({
        where: { id: matchId },
        data: { deletedAt: new Date() },
      });
    },
  );
}
