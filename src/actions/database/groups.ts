"use server";

import { doServerActionWithAuth } from "@/lib/actions";
import { getClient } from "@/lib/dbclient";
import { Prisma } from "@/lib/prisma/generated";
import { PaginationResponse, ServerResponse } from "@/types/responses";
import { PaginationState } from "@tanstack/react-table";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const editGroup = Prisma.validator<Prisma.GroupsInclude>()({
  groupMembers: {
    select: {
      userId: true,
      role: true,
    },
  },
  groupServers: {
    select: {
      serverId: true,
    },
  },
});

export type EditGroups = Prisma.GroupsGetPayload<{
  include: typeof editGroup;
}>;

const groupUsersServersSchema = Prisma.validator<Prisma.GroupsInclude>()({
  groupMembers: {
    include: {
      user: true,
    },
  },
  groupServers: {
    where: {
      server: {
        deletedAt: null,
      },
    },
    include: {
      server: true,
    },
  },
  _count: {
    select: {
      groupMembers: true,
    },
  },
});

export type GroupsWithUsersWithServers = Prisma.GroupsGetPayload<{
  include: typeof groupUsersServersSchema;
}>;

export async function getGroupsPaginated(
  pagination: PaginationState,
  sorting: { field: string; order: "asc" | "desc" },
  filter?: string,
): Promise<ServerResponse<PaginationResponse<GroupsWithUsersWithServers>>> {
  return doServerActionWithAuth(
    ["groups:view", "groups:create", "groups::moderator", "groups::admin"],
    async (session) => {
      const db = getClient();

      const where: Prisma.GroupsWhereInput = {
        deletedAt: null,
        ...(filter && {
          OR: [
            { name: { contains: filter } },
            { description: { contains: filter } },
          ],
        }),
      };

      if (
        !session.user.admin &&
        !session.user.permissions.includes("groups:view")
      ) {
        const userGroupIds = session.user.groups.map((g) => g.id);

        if (userGroupIds.length === 0) {
          return {
            data: [],
            totalCount: 0,
          };
        }

        where.id = { in: userGroupIds };
      }

      const totalCount = await db.groups.count({
        where,
      });

      const groups = await db.groups.findMany({
        where,
        skip: pagination.pageIndex * pagination.pageSize,
        take: pagination.pageSize,
        orderBy: {
          [sorting.field]: sorting.order.toLowerCase(),
        },
        include: groupUsersServersSchema,
      });

      return {
        data: groups,
        totalCount,
      };
    },
  );
}

export async function createGroup(
  group: Omit<EditGroups, "id" | "createdAt" | "updatedAt" | "deletedAt">,
): Promise<ServerResponse<GroupsWithUsersWithServers>> {
  return doServerActionWithAuth(["groups:create"], async () => {
    const db = getClient();

    const { groupMembers, groupServers, ...groupData } = group;
    const newGroup = await db.groups.create({
      data: {
        ...groupData,
        groupServers: {
          create: groupServers.map((gs) => ({
            serverId: gs.serverId,
          })),
        },
        groupMembers: {
          create: groupMembers.map((gm) => ({
            role: gm.role,
            userId: gm.userId,
          })),
        },
      },
      include: groupUsersServersSchema,
    });

    return newGroup;
  });
}

export async function updateGroup(
  groupId: string,
  group: Partial<
    Omit<EditGroups, "id" | "createdAt" | "updatedAt" | "deletedAt">
  >,
): Promise<ServerResponse<GroupsWithUsersWithServers>> {
  return doServerActionWithAuth(
    ["groups:edit", `groups:${groupId}:admin`],
    async () => {
      const db = getClient();

      const { groupMembers, groupServers, ...scalarFields } = group;

      const updatedGroup = await db.groups.update({
        where: { id: groupId },
        data: {
          ...scalarFields,
          groupServers: {
            deleteMany: {},
            create: groupServers?.map((gs) => ({
              serverId: gs.serverId,
            })),
          },
          groupMembers: {
            deleteMany: {},
            create: groupMembers?.map((gm) => ({
              role: gm.role,
              userId: gm.userId,
            })),
          },
        },
        include: groupUsersServersSchema,
      });

      return updatedGroup;
    },
  );
}

export async function deleteGroup(groupId: string): Promise<ServerResponse> {
  return doServerActionWithAuth(
    ["groups:delete", `groups:${groupId}:admin`],
    async () => {
      const db = getClient();
      await db.groups.update({
        where: { id: groupId },
        data: {
          deletedAt: new Date(),
        },
      });
    },
  );
}
