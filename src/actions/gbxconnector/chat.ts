"use server";
import { ChatConfigSchemaType } from "@/forms/server/interface/chatconfig-schema";
import { doServerActionWithAuth } from "@/lib/actions";
import { axiosAuth } from "@/lib/axios/connector";
import { ServerError, ServerResponse } from "@/types/responses";

export async function getChatConfig(
  serverId: number,
): Promise<ServerResponse<ChatConfigSchemaType>> {
  return doServerActionWithAuth(["admin", "moderator"], async () => {
    const res = await axiosAuth.get<ChatConfigSchemaType>(
      `chat/${serverId}/config`,
    );

    if (res.status !== 200) {
      throw new ServerError("Failed to fetch chat config");
    }

    return res.data;
  });
}

export async function updateChatConfig(
  serverId: number,
  config: ChatConfigSchemaType,
): Promise<ServerResponse<ChatConfigSchemaType>> {
  return doServerActionWithAuth(["admin"], async () => {
    const res = await axiosAuth.put<ChatConfigSchemaType>(
      `chat/${serverId}/config`,
      config,
    );

    if (res.status !== 200) {
      throw new ServerError("Failed to update chat config");
    }

    return res.data;
  });
}
