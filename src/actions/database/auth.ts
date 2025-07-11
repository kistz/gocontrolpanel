import { doServerAction } from "@/lib/actions";
import { getClient } from "@/lib/dbclient";
import { Prisma, Users } from "@/lib/prisma/generated";
import { ServerError, ServerResponse } from "@/types/responses";
import "server-only";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const groupsUsers = Prisma.validator<Prisma.UsersInclude>()({
  groups: {
    include: {
      group: true,
    },
  },
});

export type UsersWithGroups = Prisma.UsersGetPayload<{
  include: typeof groupsUsers;
}>;

export async function getUserById(
  id: string,
): Promise<ServerResponse<UsersWithGroups>> {
  return doServerAction(async () => {
    const db = getClient();
    const user = await db.users.findUniqueOrThrow({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        groups: {
          where: {
            group: {
              deletedAt: null,
            },
          },
          select: {
            groupId: true,
            role: true,
            userId: true,
            group: true,
          },
        },
      },
    });

    return user;
  });
}

export async function getUserByLogin(
  login: string,
): Promise<ServerResponse<UsersWithGroups>> {
  return doServerAction(async () => {
    const db = getClient();
    const user = await db.users.findFirstOrThrow({
      where: {
        login,
        deletedAt: null,
      },
      include: {
        groups: {
          where: {
            group: {
              deletedAt: null,
            },
          },
          select: {
            groupId: true,
            role: true,
            userId: true,
            group: true,
          },
        },
      },
    });

    return user;
  });
}

export async function createUserAuth(
  user: Omit<Users, "id" | "createdAt" | "updatedAt" | "deletedAt">,
): Promise<ServerResponse<UsersWithGroups>> {
  return doServerAction(async () => {
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
      data: newUser,
      include: {
        groups: {
          where: {
            group: {
              deletedAt: null,
            },
          },
          select: {
            groupId: true,
            role: true,
            userId: true,
            group: true,
          },
        },
      },
    });

    if (!result) {
      throw new ServerError("Failed to create user");
    }

    return result;
  });
}
