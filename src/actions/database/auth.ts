import { doServerAction } from "@/lib/actions";
import { getClient } from "@/lib/dbclient";
import { Users } from "@/lib/prisma/generated";
import { ServerError, ServerResponse } from "@/types/responses";
import "server-only";

export async function getUserById(id: string): Promise<ServerResponse<Users>> {
  return doServerAction(async () => {
    const db = getClient();
    const user = await db.users.findUniqueOrThrow({
      where: {
        id,
        deletedAt: null,
      },
    });

    return user;
  });
}

export async function getUserByLogin(
  login: string,
): Promise<ServerResponse<Users>> {
  return doServerAction(async () => {
    const db = getClient();
    const user = await db.users.findFirstOrThrow({
      where: {
        login,
        deletedAt: null,
      },
    });

    return user;
  });
}

export async function createUserAuth(
  user: Omit<Users, "id" | "createdAt" | "updatedAt" | "deletedAt">,
): Promise<ServerResponse<Users>> {
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
    });

    if (!result) {
      throw new ServerError("Failed to create user");
    }

    return result;
  });
}
