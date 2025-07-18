import { getClient } from "@/lib/dbclient";
import { Prisma, Users } from "@/lib/prisma/generated";
import { getList } from "@/lib/utils";
import { ServerError } from "@/types/responses";
import "server-only";

const includeGroupsWithServers = Prisma.validator<Prisma.UsersInclude>()({
  groupMembers: {
    where: {
      group: {
        deletedAt: null,
      },
    },
    select: {
      role: true,
      group: {
        select: {
          id: true,
          name: true,
          groupServers: {
            where: {
              server: {
                deletedAt: null,
              },
            },
            select: {
              server: {
                select: {
                  id: true,
                  name: true,
                  description: true,
                  host: true,
                  port: true,
                  filemanagerUrl: true,
                },
              },
            },
          },
        },
      },
    },
  },
  hetznerProjectUsers: {
    where: {
      project: {
        deletedAt: null,
      },
    },
    select: {
      role: true,
      project: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
});

export type UsersWithGroupsWithServers = Prisma.UsersGetPayload<{
  include: typeof includeGroupsWithServers;
}>;

export async function getUserById(
  userId: string,
): Promise<UsersWithGroupsWithServers> {
  const db = getClient();
  const user = await db.users.findUniqueOrThrow({
    where: {
      id: userId,
      deletedAt: null,
    },
    include: includeGroupsWithServers,
  });

  return user;
}

export async function getUserByLogin(
  login: string,
): Promise<UsersWithGroupsWithServers> {
  const db = getClient();
  const user = await db.users.findUniqueOrThrow({
    where: {
      login,
      deletedAt: null,
    },
    include: includeGroupsWithServers,
  });

  return user;
}

export async function createUserAuth(
  user: Omit<Users, "id" | "createdAt" | "updatedAt" | "deletedAt">,
): Promise<UsersWithGroupsWithServers> {
  const db = getClient();

  const existingUser = await db.users.findFirst({
    where: {
      OR: [
        { login: user.login },
        { nickName: user.nickName },
        { ubiUid: user.ubiUid },
      ],
    },
  });

  if (existingUser) {
    throw new ServerError("User with this login or nickname already exists");
  }

  const newUser = {
    ...user,
    admin: user.admin,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const result = await db.users.create({
    data: {
      ...newUser,
      permissions: getList(newUser.permissions),
    },
    include: includeGroupsWithServers,
  });

  if (!result) {
    throw new ServerError("Failed to create user");
  }

  return result;
}
