"use server";
import { ChatConfigSchemaType } from "@/forms/server/interface/chatconfig-schema";
import { doServerActionWithAuth } from "@/lib/actions";
import { axiosAuth } from "@/lib/axios/connector";
import { ServerError, ServerResponse } from "@/types/responses";
import { isAxiosError } from "axios";

export async function getChatConfig(
  serverUuid: string,
): Promise<ServerResponse<ChatConfigSchemaType>> {
  return doServerActionWithAuth(["admin", "moderator"], async () => {
    try {
      const res = await axiosAuth.get<ChatConfigSchemaType>(
        `chat/${serverUuid}/config`,
      );

      return res.data;
    } catch (error) {
      const message = isAxiosError(error)
        ? error.response?.data || "Failed to get chat config"
        : "Failed to get chat config";

      throw new ServerError(message);
    }
  });
}

export async function updateChatConfig(
  serverUuid: string,
  config: ChatConfigSchemaType,
): Promise<ServerResponse<ChatConfigSchemaType>> {
  return doServerActionWithAuth(["admin"], async () => {
    try {
      const res = await axiosAuth.put<ChatConfigSchemaType>(
        `chat/${serverUuid}/config`,
        config,
      );

      return res.data;
    } catch (error) {
      const message = isAxiosError(error)
        ? error.response?.data || "Failed to update chat config"
        : "Failed to update chat config";

      throw new ServerError(message);
    }
  });
}
