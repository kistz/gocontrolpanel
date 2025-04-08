"use client";
import { getServerSettings } from "@/actions/server";
import { Card } from "@/components/ui/card";
import SettingsForm from "@/forms/server/settings-form";
import { ServerSettingsSchema } from "@/forms/server/settings-schema";
import { useBreadcrumbs } from "@/providers/breadcrumb-provider";
import { routes } from "@/routes";
import { ServerSettings } from "@/types/server";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

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

  function onSubmit(values: ServerSettings) {
    console.log(values);
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="p-6">
      <SettingsForm form={form} onSubmit={onSubmit} />
    </Card>
  );
}
