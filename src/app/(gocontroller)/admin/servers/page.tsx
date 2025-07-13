import { getServersPaginated } from "@/actions/database/servers";
import AddServerModal from "@/components/modals/add-server";
import Modal from "@/components/modals/modal";
import { PaginationTable } from "@/components/table/pagination-table";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import { createColumns } from "./columns";

export default async function AdminServersPage() {
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

      <PaginationTable
        createColumns={createColumns}
        fetchData={getServersPaginated}
        filter
      />
    </div>
  );
}
