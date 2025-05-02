import ServerOrder from "@/components/servers/server-order";
import { Button } from "@/components/ui/button";
import { getServers } from "@/lib/gbxclient";
import { IconPlus } from "@tabler/icons-react";

export default async function AdminServersPage() {
  const servers = await getServers();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-2 justify-between items-end">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">Manage Servers</h1>
          <h4 className="text-muted-foreground">
            Manage the servers and their settings.
          </h4>
        </div>

        <Button>
          <IconPlus /> Add Server
        </Button>
      </div>

      {servers.length === 0 ? (
        <div className="text-muted-foreground">
          No servers found.
        </div>
      ) : (
        <ServerOrder servers={servers} />
      )}
    </div>
  );
}
