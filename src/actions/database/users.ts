"use server";
import { doServerActionWithAuth } from "@/lib/actions";
import { getClient } from "@/lib/dbclient";
import { Prisma, Users } from "@/lib/prisma/generated";
import { getList } from "@/lib/utils";
import {
  PaginationResponse,
  ServerError,
  ServerResponse,
} from "@/types/responses";
import { PaginationState } from "@tanstack/react-table";

export type UserMinimal = Pick<Users, "id" | "login" | "nickName">;

export async function getUsersMinimal(): Promise<
  ServerResponse<UserMinimal[]>
> {
  return doServerActionWithAuth(
    ["groups:create", "groups:edit", "groups::admin"],
    async () => {
      const db = getClient();
      const users = await db.users.findMany({
        where: {
          deletedAt: null,
        },
        select: {
          id: true,
          login: true,
          nickName: true,
        },
      });

      return users;
    },
  );
}

export async function getUsersPaginated(
  pagination: PaginationState,
  sorting: { field: string; order: "asc" | "desc" },
  filter?: string,
): Promise<ServerResponse<PaginationResponse<Users>>> {
  return doServerActionWithAuth(["users:view"], async () => {
    const db = getClient();

    const where: Prisma.UsersWhereInput = {
      deletedAt: null,
      ...(filter && {
        OR: [
          { login: { contains: filter } },
          { nickName: { contains: filter } },
          { ubiUid: { contains: filter } },
          { path: { contains: filter } },
        ],
      }),
    };

    const totalCount = await db.users.count({
      where,
    });

    const users = await db.users.findMany({
      where,
      skip: pagination.pageIndex * pagination.pageSize,
      take: pagination.pageSize,
      orderBy: {
        [sorting.field]: sorting.order.toLowerCase(),
      },
    });

    return {
      data: users,
      totalCount,
    };
  });
}

export async function updateUser(
  userId: string,
  data: Omit<
    Users,
    | "id"
    | "login"
    | "nickName"
    | "path"
    | "ubiUid"
    | "createdAt"
    | "updatedAt"
    | "deletedAt"
  >,
): Promise<ServerResponse> {
  return doServerActionWithAuth(["users:edit"], async () => {
    const db = getClient();

    const existingUser = await db.users.findUniqueOrThrow({
      where: {
        id: userId,
      },
    });

    const isRemovingAdmin = existingUser.admin && !data.admin;

    if (isRemovingAdmin) {
      throw new ServerError("Cannot remove admin role");
    }

    await db.users.update({
      where: { id: userId },
      data: {
        ...data,
        permissions: getList(data.permissions),
      },
    });
  });
}

export async function deleteUserById(userId: string): Promise<ServerResponse> {
  return doServerActionWithAuth(["users:delete"], async (session) => {
    if (userId === session.user.id) {
      throw new ServerError("Cannot delete your own account");
    }

    const db = getClient();
    await db.users.update({
      where: { id: userId },
      data: {
        deletedAt: new Date(),
      },
    });
  });
}
