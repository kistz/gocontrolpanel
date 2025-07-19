"use server";

import { doServerActionWithAuth } from "@/lib/actions";
import { getClient } from "@/lib/dbclient";
import { getGbxClientManager } from "@/lib/gbxclient";
import { Prisma, Servers } from "@/lib/prisma/generated";
import { PaginationResponse, ServerResponse } from "@/types/responses";
import { PaginationState } from "@tanstack/react-table";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const editServer = Prisma.validator<Prisma.ServersInclude>()({
  userServers: {
    select: {
      userId: true,
      role: true,
    },
  },
});

export type EditServers = Prisma.ServersGetPayload<{
  include: typeof editServer;
}>;

const serversUsersSchema = Prisma.validator<Prisma.ServersInclude>()({
  userServers: {
    where: {
      user: {
        deletedAt: null,
      },
    },
    include: {
      user: true,
    },
  },
});

export type ServersWithUsers = Prisma.ServersGetPayload<{
  include: typeof serversUsersSchema;
}>;

export type ServerMinimal = Pick<Servers, "id" | "name">;

export async function getServersMinimal(): Promise<
  ServerResponse<ServerMinimal[]>
> {
  return doServerActionWithAuth(
    ["groups:create", "groups:edit", "groups::admin", "servers:view"],
    async (session) => {
      const db = getClient();

      const where: Prisma.ServersWhereInput = {
        deletedAt: null,
      };

      if (
        !session.user.admin &&
        !session.user.permissions.includes("servers:view")
      ) {
        const userServers = session.user.servers.map((s) => s.id);
        session.user.groups.forEach((group) => {
          group.servers.forEach((server) => {
            if (!userServers.includes(server.id)) {
              userServers.push(server.id);
            }
          });
        });

        where.id = { in: userServers };
      }

      return await db.servers.findMany({
        where,
        select: {
          id: true,
          name: true,
        },
      });
    },
  );
}

export async function getServersPaginated(
  pagination: PaginationState,
  sorting: { field: string; order: "asc" | "desc" },
  filter?: string,
): Promise<ServerResponse<PaginationResponse<ServersWithUsers>>> {
  return doServerActionWithAuth(
    ["servers:view", "servers::moderator", "servers::admin"],
    async (session) => {
      const db = getClient();

      const where: Prisma.ServersWhereInput = {
        deletedAt: null,
        ...(filter && {
          name: { contains: filter },
        }),
      };

      if (
        !session.user.admin &&
        !session.user.permissions.includes("servers:view")
      ) {
        const userServerIds = session.user.servers.map((s) => s.id);

        if (userServerIds.length === 0) {
          return {
            data: [],
            totalCount: 0,
          };
        }

        where.id = { in: userServerIds };
      }

      const totalCount = await db.servers.count({
        where,
      });

      const servers = await db.servers.findMany({
        skip: pagination.pageIndex * pagination.pageSize,
        take: pagination.pageSize,
        orderBy: { [sorting.field]: sorting.order },
        where,
        include: serversUsersSchema,
      });

      return {
        data: servers,
        totalCount,
      };
    },
  );
}

export async function createServer(
  server: Omit<
    EditServers,
    | "id"
    | "manualRouting"
    | "messageFormat"
    | "connectMessage"
    | "disconnectMessage"
    | "createdAt"
    | "updatedAt"
    | "deletedAt"
  >,
): Promise<ServerResponse<ServersWithUsers>> {
  return doServerActionWithAuth(["servers:create"], async () => {
    const db = getClient();

    const { userServers, ...serverData } = server;
    const newServer = await db.servers.create({
      data: {
        ...serverData,
        userServers: {
          create: userServers.map((us) => ({
            userId: us.userId,
            role: us.role,
          })),
        },
      },
      include: serversUsersSchema,
    });
    return newServer;
  });
}

export async function updateServer(
  serverId: string,
  server: Partial<
    Omit<
      EditServers,
      | "id"
      | "manualRouting"
      | "messageFormat"
      | "connectMessage"
      | "disconnectMessage"
      | "createdAt"
      | "updatedAt"
    >
  >,
): Promise<ServerResponse<ServersWithUsers>> {
  return doServerActionWithAuth(
    ["servers:edit", `servers:${serverId}:admin`],
    async () => {
      const db = getClient();

      const { userServers, ...scalarFields } = server;
      const updatedServer = await db.servers.update({
        where: { id: serverId },
        data: {
          ...scalarFields,
          userServers: {
            deleteMany: {},
            create: userServers?.map((us) => ({
              userId: us.userId,
              role: us.role,
            })),
          },
        },
        include: serversUsersSchema,
      });
      return updatedServer;
    },
  );
}

export async function getServerChatConfig(
  serverId: string,
): Promise<
  ServerResponse<
    Pick<
      Servers,
      "manualRouting" | "messageFormat" | "connectMessage" | "disconnectMessage"
    >
  >
> {
  return doServerActionWithAuth([`servers:${serverId}:admin`], async () => {
    const db = getClient();
    const server = await db.servers.findUnique({
      where: { id: serverId },
      select: {
        manualRouting: true,
        messageFormat: true,
        connectMessage: true,
        disconnectMessage: true,
      },
    });
    if (!server) {
      throw new Error("Server not found");
    }
    return server;
  });
}

export async function updateServerChatConfig(
  serverId: string,
  chatConfig: Pick<
    Servers,
    "manualRouting" | "messageFormat" | "connectMessage" | "disconnectMessage"
  >,
): Promise<ServerResponse<Servers>> {
  return doServerActionWithAuth([`servers:${serverId}:admin`], async () => {
    const manager = await getGbxClientManager(serverId);
    let err;
    try {
      await manager.client.call(
        "ChatEnableManualRouting",
        chatConfig.manualRouting,
      );
    } catch (e) {
      err = e;
      chatConfig.manualRouting = false;
    }

    const db = getClient();
    const updatedServer = await db.servers.update({
      where: { id: serverId },
      data: { ...chatConfig },
    });

    manager.info.chat = chatConfig;

    if (err) {
      throw err;
    }

    return updatedServer;
  });
}

export async function deleteServer(serverId: string): Promise<ServerResponse> {
  return doServerActionWithAuth(
    ["servers:delete", `servers:${serverId}:admin`],
    async () => {
      const db = getClient();
      await db.servers.update({
        where: { id: serverId },
        data: { deletedAt: new Date() },
      });
    },
  );
}
