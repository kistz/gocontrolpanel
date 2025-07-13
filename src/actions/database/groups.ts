"use server";

import { doServerActionWithAuth } from "@/lib/actions";
import { getClient } from "@/lib/dbclient";
import { Prisma } from "@/lib/prisma/generated";
import { getList } from "@/lib/utils";
import { PaginationResponse, ServerResponse } from "@/types/responses";
import { PaginationState } from "@tanstack/react-table";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const editGroups = Prisma.validator<Prisma.GroupsInclude>()({
  users: {
    select: {
      userId: true,
      role: true,
    },
  },
});

export type EditGroups = Prisma.GroupsGetPayload<{
  include: typeof editGroups;
}>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const usersGroups = Prisma.validator<Prisma.GroupsInclude>()({
  users: {
    include: {
      user: true,
    },
  },
  _count: {
    select: {
      users: true,
    },
  },
});

export type GroupsWithUsers = Prisma.GroupsGetPayload<{
  include: typeof usersGroups;
}>;

export async function getAllGroups(): Promise<
  ServerResponse<GroupsWithUsers[]>
> {
  return doServerActionWithAuth([], async () => {
    const db = getClient();
    const groups = await db.groups.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        users: {
          where: {
            user: {
              deletedAt: null,
            },
          },
          select: {
            userId: true,
            groupId: true,
            role: true,
            user: true,
          },
        },
        _count: {
          select: {
            users: true,
          },
        },
      },
    });

    return groups;
  });
}

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
      include: {
        users: {
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
            users: true,
          },
        },
      },
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
      include: {
        users: {
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
            users: true,
          },
        },
      },
    });

    return group;
  });
}

export async function createGroup(
  group: Omit<EditGroups, "id" | "createdAt" | "updatedAt" | "deletedAt">,
): Promise<ServerResponse<GroupsWithUsers>> {
  return doServerActionWithAuth([], async () => {
    const db = getClient();

    const { users, ids, ...groupData } = group;
    const newGroup = await db.groups.create({
      data: {
        ...groupData,
        ids: ids ?? [],
        users: {
          create: users.map((member) => ({
            role: member.role,
            userId: member.userId,
          })),
        },
      },
      include: {
        users: {
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
            users: true,
          },
        },
      },
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

    const { users, ids, ...scalarFields } = group;

    const currentMembers = await db.groupMember.findMany({
      where: { groupId },
      select: { userId: true, role: true },
    });

    if (!users) {
      const updatedGroup = await db.groups.update({
        where: { id: groupId },
        data: {
          ...scalarFields,
          ids: ids ?? [],
        },
        include: {
          users: {
            where: {
              user: {
                deletedAt: null,
              },
            },
            include: { user: true },
          },
          _count: {
            select: {
              users: true,
            },
          },
        },
      });
      return updatedGroup;
    }

    const usersMap = new Map(users.map((u) => [u.userId, u.role]));
    const currentMap = new Map(currentMembers.map((m) => [m.userId, m.role]));

    const toAdd = users.filter((u) => !currentMap.has(u.userId));

    const toRemove = currentMembers.filter((m) => !usersMap.has(m.userId));

    const toUpdate = users.filter((u) => {
      const currentRole = currentMap.get(u.userId);
      return currentRole && currentRole !== u.role;
    });

    const updateData: any = {
      ...scalarFields,
      ids: ids ?? [],
      users: {
        deleteMany: toRemove.map((m) => ({
          userId: m.userId,
          groupId: groupId,
        })),
        create: toAdd.map((m) => ({ userId: m.userId, role: m.role })),
        updateMany: toUpdate.map((m) => ({
          where: {
            userId: m.userId,
            groupId: groupId,
          },
          data: { role: m.role },
        })),
      },
    };

    const updatedGroup = await db.groups.update({
      where: { id: groupId },
      data: updateData,
      include: {
        users: {
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
            users: true,
          },
        },
      },
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

export async function removeidFromGroups(id: string): Promise<ServerResponse> {
  return doServerActionWithAuth([], async () => {
    const db = getClient();

    const groups = await db.groups.findMany({
      where: {
        ids: {
          array_contains: [id],
        },
      },
    });

    if (groups.length === 0) return;

    await Promise.all(
      groups.map((group) =>
        db.groups.update({
          where: { id: group.id },
          data: {
            ids: getList(group.ids).filter((uuid) => uuid !== id),
          },
        }),
      ),
    );
  });
}
