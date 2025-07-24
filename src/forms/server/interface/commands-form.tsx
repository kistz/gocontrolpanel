"use client";

import { ServerCommandsWithCommand } from "@/actions/database/gbx";
import { updateServerCommands } from "@/actions/database/servers";
import FormElement from "@/components/form/form-element";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Commands } from "@/lib/prisma/generated";
import { getErrorMessage } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { CommandsSchema, CommandsSchemaType } from "./commands-schema";

export default function CommandsForm({
  serverId,
  serverCommands,
  commands,
}: {
  serverId: string;
  serverCommands: ServerCommandsWithCommand[];
  commands: Commands[];
}) {
  const defaultValues: CommandsSchemaType = commands.reduce((acc, cmd) => {
    acc[cmd.name as keyof CommandsSchemaType] =
      serverCommands.find((sc) => sc.commandId === cmd.id)?.enabled ?? false;
    return acc;
  }, {} as CommandsSchemaType);

  const form = useForm<CommandsSchemaType>({
    resolver: zodResolver(CommandsSchema),
    defaultValues,
  });

  async function onSubmit(values: CommandsSchemaType) {
    try {
      const { error } = await updateServerCommands(
        serverId,
        commands.map((c) => ({
          commandId: c.id,
          enabled: values[c.name as keyof CommandsSchemaType] ?? false,
        })),
      );
      if (error) {
        throw new Error(error);
      }
      toast.success("Commands successfully saved");
    } catch (error) {
      toast.error("Failed to save commands", {
        description: getErrorMessage(error),
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <FormElement
          name="admin"
          label="Admin Command"
          type="checkbox"
          description="/admin. Allows players to notify an admin."
        />

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="max-w-24"
        >
          Save
        </Button>
      </form>
    </Form>
  );
}
