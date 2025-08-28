"use client";

import { ServerPluginsWithPlugin } from "@/actions/database/gbx";
import { updateServerPlugins } from "@/actions/database/server-plugins";
import FormElement from "@/components/form/form-element";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Plugins } from "@/lib/prisma/generated";
import { getErrorMessage } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { PluginsSchema, PluginsSchemaType } from "./plugins-schema";

export default function PluginsForm({
  serverId,
  serverPlugins,
  plugins,
}: {
  serverId: string;
  serverPlugins: ServerPluginsWithPlugin[];
  plugins: Plugins[];
}) {
  const defaultValues: PluginsSchemaType = plugins.reduce((acc, plg) => {
    if (!acc[plg.name as keyof PluginsSchemaType]) {
      acc[plg.name as keyof PluginsSchemaType] = { enabled: false, config: {} };
    }

    acc[plg.name as keyof PluginsSchemaType].enabled =
      serverPlugins.find((sp) => sp.pluginId === plg.id)?.enabled ?? false;

    return acc;
  }, {} as PluginsSchemaType);

  const form = useForm<PluginsSchemaType>({
    resolver: zodResolver(PluginsSchema),
    defaultValues,
  });

  async function onSubmit(values: PluginsSchemaType) {
    try {
      const { error } = await updateServerPlugins(
        serverId,
        plugins.map((p) => ({
          pluginId: p.id,
          enabled: values[p.name as keyof PluginsSchemaType].enabled ?? false,
          config: values[p.name as keyof PluginsSchemaType].config,
        })),
      );
      if (error) {
        throw new Error(error);
      }
      toast.success("Plugins successfully saved");
    } catch (error) {
      toast.error("Failed to save plugins", {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FormElement
            name="admin.enabled"
            label="Admin Plugin"
            type="checkbox"
            description="Allows players to notify an admin with the /admin command."
          />

          <FormElement
            name="ecm.enabled"
            label="eCircuitMania Plugin"
            type="checkbox"
            description="A plugin to integrate with the eCircuitMania API. This plugin will automatically send match data to eCircuitMania."
          />
        </div>

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="max-w-24"
        >
          <IconDeviceFloppy />
          Save
        </Button>
      </form>
    </Form>
  );
}
