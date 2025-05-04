import { getServers } from "@/actions/gbxconnector/servers";
import AddServerModal from "@/components/modals/add-server";
import Modal from "@/components/modals/modal";
import ServerOrder from "@/components/servers/server-order";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";

export default async function AdminServersPage() {
  const servers = await getServers();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-2 justify-between items-end">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">Manage Servers</h1>
          <h4 className="text-muted-foreground">
            Manage the servers and their order.
          </h4>
        </div>

        <Modal>
          <AddServerModal />
          <Button>
            <IconPlus /> Add Server
          </Button>
        </Modal>
      </div>

      {servers.length === 0 ? (
        <div className="text-muted-foreground">No servers found.</div>
      ) : (
        <ServerOrder servers={servers} />
      )}
    </div>
  );
}

export const dynamic = "force-dynamic";
