"use server";

import { doServerActionWithAuth } from "@/lib/actions";
import { getClient } from "@/lib/dbclient";
import { decryptHetznerToken, encryptHetznerToken } from "@/lib/hetzner";
import { Prisma } from "@/lib/prisma/generated";
import { getList } from "@/lib/utils";
import { PaginationResponse, ServerResponse } from "@/types/responses";
import { PaginationState } from "@tanstack/react-table";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const editHetznerProject = Prisma.validator<Prisma.HetznerProjectsInclude>()({
  hetznerProjectUsers: {
    select: {
      userId: true,
      role: true,
    },
  },
});

export type EditHetznerProjects = Prisma.HetznerProjectsGetPayload<{
  include: typeof editHetznerProject;
}>;

const hetznerProjectUsersSchema =
  Prisma.validator<Prisma.HetznerProjectsInclude>()({
    hetznerProjectUsers: {
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
        hetznerProjectUsers: true,
      },
    },
  });

export type HetznerProjectsWithUsers = Prisma.HetznerProjectsGetPayload<{
  include: typeof hetznerProjectUsersSchema;
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
      include: hetznerProjectUsersSchema,
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
      include: hetznerProjectUsersSchema,
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
        ...(!session?.user?.admin && {
          users: { some: { userId } },
        }),
      },
      include: hetznerProjectUsersSchema,
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

    const { hetznerProjectUsers, apiTokens, ...projectData } = hetznerProject;
    const newProject = await db.hetznerProjects.create({
      data: {
        ...projectData,
        apiTokens: getList(apiTokens).map((token) =>
          encryptHetznerToken(token),
        ),
        hetznerProjectUsers: {
          create: hetznerProjectUsers.map((hpu) => ({
            role: hpu.role,
            userId: hpu.userId,
          })),
        },
      },
      include: hetznerProjectUsersSchema,
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
  hetznerProjectId: string,
  hetznerProject: Partial<
    Omit<EditHetznerProjects, "id" | "createdAt" | "updatedAt" | "deletedAt">
  >,
): Promise<ServerResponse<HetznerProjectsWithUsers>> {
  return doServerActionWithAuth([], async (session) => {
    const db = getClient();

    const userId = session?.user?.id;
    const { hetznerProjectUsers, apiTokens, ...projectData } = hetznerProject;

    const updatedHetznerProject = await db.hetznerProjects.update({
      where: {
        id: hetznerProjectId,
        ...(!session?.user?.admin && {
          users: { some: { userId } },
        }),
      },
      data: {
        ...projectData,
        apiTokens: getList(apiTokens).map((token) =>
          encryptHetznerToken(token),
        ),
        hetznerProjectUsers: {
          deleteMany: {},
          create: hetznerProjectUsers?.map((hpu) => ({
            role: hpu.role,
            userId: hpu.userId,
          })),
        },
      },
      include: hetznerProjectUsersSchema,
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
  hetznerProjectId: string,
): Promise<ServerResponse> {
  return doServerActionWithAuth([], async (session) => {
    const db = getClient();

    const userId = session?.user?.id;
    await db.hetznerProjects.update({
      where: {
        id: hetznerProjectId,
        ...(!session?.user?.admin && {
          users: { some: { userId } },
        }),
      },
      data: { deletedAt: new Date() },
    });
  });
}
