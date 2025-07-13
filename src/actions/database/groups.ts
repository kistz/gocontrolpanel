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

const groupUsersSchema = Prisma.validator<Prisma.GroupsInclude>()({
  groupMembers: {
    where: {
      user: {
        deletedAt: null,
      },
    },
    include: {
      user: true,
    },
  },
  _count: {
    select: {
      groupMembers: true,
    },
  },
});

export type GroupsWithUsers = Prisma.GroupsGetPayload<{
  include: typeof groupUsersSchema;
}>;

export async function getGroupsPaginated(
  pagination: PaginationState,
  sorting: { field: string; order: "asc" | "desc" },
  filter?: string,
): Promise<ServerResponse<PaginationResponse<GroupsWithUsers>>> {
  return doServerActionWithAuth([], async () => {
    const db = getClient();

    const totalCount = await db.groups.count({
      where: {
        deletedAt: null,
        ...(filter && {
          OR: [
            { name: { contains: filter } },
            { description: { contains: filter } },
          ],
        }),
      },
    });

    const groups = await db.groups.findMany({
      where: {
        deletedAt: null,
        ...(filter && {
          OR: [
            { name: { contains: filter } },
            { description: { contains: filter } },
          ],
        }),
      },
      skip: pagination.pageIndex * pagination.pageSize,
      take: pagination.pageSize,
      orderBy: {
        [sorting.field]: sorting.order.toLowerCase(),
      },
      include: groupUsersSchema,
    });

    return {
      data: groups,
      totalCount,
    };
  });
}

export async function getGroup(
  groupId: string,
): Promise<ServerResponse<GroupsWithUsers | null>> {
  return doServerActionWithAuth([], async () => {
    const db = getClient();
    const group = await db.groups.findUnique({
      where: { id: groupId },
      include: groupUsersSchema,
    });

    return group;
  });
}

export async function createGroup(
  group: Omit<EditGroups, "id" | "createdAt" | "updatedAt" | "deletedAt">,
): Promise<ServerResponse<GroupsWithUsers>> {
  return doServerActionWithAuth([], async () => {
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
      include: groupUsersSchema,
    });

    return newGroup;
  });
}

export async function updateGroup(
  groupId: string,
  group: Partial<
    Omit<EditGroups, "id" | "createdAt" | "updatedAt" | "deletedAt">
  >,
): Promise<ServerResponse<GroupsWithUsers>> {
  return doServerActionWithAuth([], async () => {
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
      include: groupUsersSchema,
    });

    return updatedGroup;
  });
}

export async function deleteGroup(groupId: string): Promise<ServerResponse> {
  return doServerActionWithAuth([], async () => {
    const db = getClient();
    await db.groups.update({
      where: { id: groupId },
      data: {
        deletedAt: new Date(),
      },
    });
  });
}

export async function removeServerFromGroups(
  serverId: string,
): Promise<ServerResponse> {
  return doServerActionWithAuth([], async () => {
    const db = getClient();

    // First, find all group-server relations with the given serverId
    await db.groupServers.deleteMany({
      where: {
        serverId,
      },
    });
  });
}
