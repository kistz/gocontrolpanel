"use server";

import { doServerActionWithAuth } from "@/lib/actions";
import { getClient } from "@/lib/dbclient";
import { Prisma } from "@/lib/prisma/generated";
import { getList } from "@/lib/utils";
import { PaginationResponse, ServerResponse } from "@/types/responses";

const editHetznerProjects = Prisma.validator<Prisma.HetznerProjectsInclude>()({
  users: {
    select: {
      userId: true,
      role: true,
    },
  },
});

export type EditHetznerProjects = Prisma.HetznerProjectsGetPayload<{
  include: typeof editHetznerProjects;
}>;

const usersHetznerProjects = Prisma.validator<Prisma.HetznerProjectsInclude>()({
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

export type HetznerProjectsWithUsers = Prisma.HetznerProjectsGetPayload<{
  include: typeof usersHetznerProjects;
}>;

export async function getHetznerProjectsPaginated(
  pagination: { skip: number; limit: number },
  sorting: { field: string; order: string },
  filter?: string,
): Promise<ServerResponse<PaginationResponse<HetznerProjectsWithUsers>>> {
  return doServerActionWithAuth([], async () => {
    const db = getClient();

    const totalCount = await db.hetznerProjects.count({
      where: {
        deletedAt: null,
      },
    });

    const hetznerProjects = await db.hetznerProjects.findMany({
      where: {
        deletedAt: null,
      },
      skip: pagination.skip,
      take: pagination.limit,
      orderBy: {
        [sorting.field]: sorting.order.toLowerCase() as "asc" | "desc",
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
      data: hetznerProjects,
      totalCount,
    };
  });
}

export async function getHetznerProject(
  hetznerProjectId: string,
): Promise<ServerResponse<HetznerProjectsWithUsers | null>> {
  return doServerActionWithAuth([], async () => {
    const db = getClient();
    const hetznerProject = await db.hetznerProjects.findUnique({
      where: { id: hetznerProjectId },
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

    return hetznerProject;
  });
}

export async function createHetznerProject(
  hetznerProject: Omit<
    EditHetznerProjects,
    "id" | "createdAt" | "updatedAt" | "deletedAt"
  >,
): Promise<ServerResponse<HetznerProjectsWithUsers>> {
  return doServerActionWithAuth([], async () => {
    const db = getClient();

    const { users, apiTokens, ...projectData } = hetznerProject;
    const newProject = await db.hetznerProjects.create({
      data: {
        ...projectData,
        apiTokens: getList(apiTokens),
        users: {
          create: users.map((user) => ({
            role: user.role,
            userId: user.userId,
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

    return newProject;
  });
}

export async function updateHetznerProject(
  projectId: string,
  hetznerProject: Partial<
    Omit<EditHetznerProjects, "id" | "createdAt" | "updatedAt" | "deletedAt">
  >,
): Promise<ServerResponse<HetznerProjectsWithUsers>> {
  return doServerActionWithAuth([], async () => {
    const db = getClient();

    const { users, apiTokens, ...projectData } = hetznerProject;

    const currentUsers = await db.hetznerProjectUser.findMany({
      where: { projectId },
      select: { userId: true, role: true },
    });

    if (!users) {
      const updatedHetznerProject = await db.hetznerProjects.update({
        where: { id: projectId },
        data: {
          ...projectData,
          apiTokens: getList(apiTokens),
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

      return updatedHetznerProject;
    }

    const usersMap = new Map(users.map((u) => [u.userId, u.role]));
    const currentMap = new Map(currentUsers.map((u) => [u.userId, u.role]));

    const toAdd = users.filter((user) => !currentMap.has(user.userId));

    const toRemove = currentUsers.filter((u) => !usersMap.has(u.userId));

    const toUpdate = users.filter((u) => {
      const currentRole = currentMap.get(u.userId);
      return currentRole && currentRole !== u.role;
    });

    const updateData: any = {
      ...projectData,
      apiTokens: getList(apiTokens),
      users: {
        deleteMany: toRemove.map((u) => ({
          userId: u.userId,
          hetznerProjectId: projectId,
        })),
        create: toAdd.map((user) => ({
          userId: user.userId,
          role: user.role,
        })),
        updateMany: toUpdate.map((user) => ({
          where: {
            userId: user.userId,
            hetznerProjectId: projectId,
          },
          data: { role: user.role },
        })),
      },
    };

    const updatedHetznerProject = await db.hetznerProjects.update({
      where: { id: projectId },
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

    return updatedHetznerProject;
  });
}
