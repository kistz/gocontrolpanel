"use client";
import { getServerSettings, saveServerSettings } from "@/actions/server";
import { Card } from "@/components/ui/card";
import SettingsForm from "@/forms/server/settings-form";
import { ServerSettingsSchema } from "@/forms/server/settings-schema";
import { useBreadcrumbs } from "@/providers/breadcrumb-provider";
import { routes } from "@/routes";
import { ServerSettings } from "@/types/server";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ServerSettingsPage() {
  const [isLoading, setIsLoading] = useState(true);

  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([
      { label: "Server", path: routes.admin.server.settings },
      { label: "Settings" },
    ]);
  }, []);

  const form = useForm<ServerSettings>({
    resolver: zodResolver(ServerSettingsSchema),
    defaultValues: async () => {
      const settings = await getServerSettings();
      setIsLoading(false);
      return settings;
    },
  });

  async function onSubmit(values: ServerSettings) {
    try {
      if (await saveServerSettings(values)) {
        toast.success("Settings saved successfully");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error("Failed to save settings", {
        description: errorMessage,
      });
    }
  }

  if (isLoading) {
    return <div className="flex justify-center"><div className="w-12 h-12 border-4 border-t-4 rounded-full animate-spin border-t-(--primary)"></div></div>;
  }

  return (
    <Card className="p-6">
      <SettingsForm form={form} onSubmit={onSubmit} />
    </Card>
  );
}
