import { Card } from "@/components/ui/card";
import SettingsForm from "@/forms/server/settings/settings-form";

export default async function ServerSettingsPage({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Server Settings</h1>
        <h4 className="text-muted-foreground">
          Manage general server settings.
        </h4>
      </div>
      <Card className="p-6">
        <SettingsForm id={uuid} />
      </Card>
    </div>
  );
}
