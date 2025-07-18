"use server";
import { ServerResponse } from "@/types/responses";
import { Session } from "next-auth";
import { withAuth } from "./auth";
import { getErrorMessage } from "./utils";

export async function doServerAction<T>(
  action: () => Promise<T>,
): Promise<ServerResponse<T>> {
  try {
    const result = await action();
    return {
      data: result,
    };
  } catch (error) {
    console.error("Error during server action", error);

    return {
      data: undefined as T,
      error: getErrorMessage(error),
    };
  }
}

export async function doServerActionWithAuth<T>(
  roles: string[],
  action: (session: Session) => Promise<T>,
): Promise<ServerResponse<T>> {
  let session: Session | null = null;
  try {
    session = await withAuth(roles);
  } catch (error) {
    console.error("Error during server action with auth:", error);
    return {
      data: undefined as T,
      error: getErrorMessage(error),
    };
  }

  try {
    const result = await action(session);
    return {
      data: result,
    };
  } catch (error) {
    console.error("Error during server action with auth:", error);

    return {
      data: undefined as T,
      error: getErrorMessage(error),
    };
  }
}
