"use server";

import { doServerActionWithAuth } from "@/lib/actions";
import { getClient } from "@/lib/dbclient";
import { decryptHetznerToken, encryptHetznerToken } from "@/lib/hetzner";
import { Prisma } from "@/lib/prisma/generated";
import { getList } from "@/lib/utils";
import { PaginationResponse, ServerResponse } from "@/types/responses";
import { PaginationState } from "@tanstack/react-table";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

export async function getAllHetznerProjects(): Promise<
  ServerResponse<HetznerProjectsWithUsers[]>
> {
  return doServerActionWithAuth([], async () => {
    const db = getClient();

    const hetznerProjects = await db.hetznerProjects.findMany({
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

    return hetznerProjects.map((project) => ({
      ...project,
      apiTokens: getList(project.apiTokens).map((token) =>
        decryptHetznerToken(token),
      ),
    }));
  });
}

export async function getHetznerProjectsPaginated(
  pagination: PaginationState,
  sorting: { field: string; order: "asc" | "desc" },
  filter?: string,
): Promise<ServerResponse<PaginationResponse<HetznerProjectsWithUsers>>> {
  return doServerActionWithAuth([], async () => {
    const db = getClient();

    const totalCount = await db.hetznerProjects.count({
      where: {
        deletedAt: null,
      },
    });

    const projects = await db.hetznerProjects.findMany({
      where: {
        deletedAt: null,
        ...(filter && {
          OR: [{ name: { contains: filter } }],
        }),
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
      orderBy: { [sorting.field]: sorting.order },
      skip: pagination.pageIndex * pagination.pageSize,
      take: pagination.pageSize,
    });

    return {
      totalCount,
      data: projects.map((project) => ({
        ...project,
        apiTokens: getList(project.apiTokens).map((token) =>
          decryptHetznerToken(token),
        ),
      })),
    };
  });
}

export async function getHetznerProject(
  hetznerProjectId: string,
): Promise<ServerResponse<HetznerProjectsWithUsers | null>> {
  return doServerActionWithAuth([], async (session) => {
    const db = getClient();
    const userId = session?.user?.id;
    const hetznerProject = await db.hetznerProjects.findUnique({
      where: {
        id: hetznerProjectId,
        ...(session?.user?.admin && {
          users: { some: { userId } },
        }),
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

    if (!hetznerProject) {
      return null;
    }

    return {
      ...hetznerProject,
      apiTokens: getList(hetznerProject.apiTokens).map((token) =>
        decryptHetznerToken(token),
      ),
    };
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
        apiTokens: getList(apiTokens).map((token) =>
          encryptHetznerToken(token),
        ),
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

    return {
      ...newProject,
      apiTokens: getList(newProject.apiTokens).map((token) =>
        decryptHetznerToken(token),
      ),
    };
  });
}

export async function updateHetznerProject(
  projectId: string,
  hetznerProject: Partial<
    Omit<EditHetznerProjects, "id" | "createdAt" | "updatedAt" | "deletedAt">
  >,
): Promise<ServerResponse<HetznerProjectsWithUsers>> {
  return doServerActionWithAuth([], async (session) => {
    const db = getClient();

    const userId = session?.user?.id;
    const { users, apiTokens, ...projectData } = hetznerProject;

    const currentUsers = await db.hetznerProjectUser.findMany({
      where: { projectId },
      select: { userId: true, role: true },
    });

    if (!users) {
      const updatedHetznerProject = await db.hetznerProjects.update({
        where: {
          id: projectId,
          ...(session?.user?.admin && {
            users: { some: { userId } },
          }),
        },
        data: {
          ...projectData,
          apiTokens: getList(apiTokens).map((token) =>
            encryptHetznerToken(token),
          ),
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
        ...updatedHetznerProject,
        apiTokens: getList(updatedHetznerProject.apiTokens).map((token) =>
          decryptHetznerToken(token),
        ),
      };
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
      apiTokens: getList(apiTokens).map((token) => encryptHetznerToken(token)),
      users: {
        deleteMany: toRemove.map((u) => ({
          userId: u.userId,
          projectId,
        })),
        create: toAdd.map((user) => ({
          userId: user.userId,
          role: user.role,
        })),
        updateMany: toUpdate.map((user) => ({
          where: {
            userId: user.userId,
            projectId,
          },
          data: { role: user.role },
        })),
      },
    };

    const updatedHetznerProject = await db.hetznerProjects.update({
      where: {
        id: projectId,
        ...(session?.user?.admin && {
          users: { some: { userId } },
        }),
      },
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

    return {
      ...updatedHetznerProject,
      apiTokens: getList(updatedHetznerProject.apiTokens).map((token) =>
        decryptHetznerToken(token),
      ),
    };
  });
}

export async function deleteHetznerProject(
  projectId: string,
): Promise<ServerResponse> {
  return doServerActionWithAuth([], async (session) => {
    const db = getClient();

    const userId = session?.user?.id;
    await db.hetznerProjects.update({
      where: {
        id: projectId,
        ...(session?.user?.admin && {
          users: { some: { userId } },
        }),
      },
      data: { deletedAt: new Date() },
    });
  });
}
