"use client";

import { updateChatConfig } from "@/actions/gbxconnector/chat";
import FormElement from "@/components/form/form-element";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { getErrorMessage } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ChatConfigSchema, ChatConfigSchemaType } from "./chatconfig-schema";
import { useSession } from "next-auth/react";

export default function ChatConfigForm({
  serverId,
  chatConfig,
}: {
  serverId: number;
  chatConfig: ChatConfigSchemaType;
}) {
  const session = useSession();

  const form = useForm<ChatConfigSchemaType>({
    resolver: zodResolver(ChatConfigSchema),
    defaultValues: chatConfig,
  });

  async function onSubmit(values: ChatConfigSchemaType) {
    try {
      const { error } = await updateChatConfig(serverId, values);
      if (error) {
        throw new Error(error);
      }
      toast.success("Chat configuration successfully saved");
    } catch (error) {
      toast.error("Failed to save chat configuration", {
        description: getErrorMessage(error),
      });
    }
  }

  const messageFormatValue = form.watch(
    "messageFormat",
    chatConfig.messageFormat ?? "",
  );

  function formatMessage(
    format: string,
  ): string {
    let msg = format
      .replaceAll("{login}", session.data?.user.login ?? "v8vgGbx_TuKkBabAyn7nsQ")
      .replaceAll("{nickName}", session.data?.user.displayName ?? "Marijntje04")
      .replaceAll("{message}", "Nice time!");
    return msg.trim();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <FormElement
          control={form.control}
          name={"manualRouting"}
          label="Manual Routing"
          description="Enable manual routing for chat messages."
          error={form.formState.errors.manualRouting}
          type="checkbox"
          isRequired
        />

        <FormElement
          control={form.control}
          name={"messageFormat"}
          label="Message Format"
          description="Define the format for chat messages. Available variables: {login}, {nickName}, {message}."
          error={form.formState.errors.messageFormat}
          type="text"
          placeholder="e.g. {nickName}: {message}"
          className="max-w-128"
        />

        {messageFormatValue && (
          <span className="text-sm text-muted-foreground -mt-2">
            {'>'} {formatMessage(messageFormatValue)}
          </span>
        )}

        <Button type="submit" disabled={form.formState.isSubmitting}>
          Save
        </Button>
      </form>
    </Form>
  );
}
