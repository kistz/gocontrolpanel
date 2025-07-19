import { getServersPaginated } from "@/actions/database/servers";
import AddServerModal from "@/components/modals/add-server";
import Modal from "@/components/modals/modal";
import { PaginationTable } from "@/components/table/pagination-table";
import { Button } from "@/components/ui/button";
import { hasPermission } from "@/lib/auth";
import { routePermissions, routes } from "@/routes";
import { IconPlus } from "@tabler/icons-react";
import { redirect } from "next/navigation";
import { createColumns } from "./columns";

export default async function AdminServersPage() {
  const canView = await hasPermission(routePermissions.admin.servers.view);
  if (!canView) {
    redirect(routes.dashboard);
  }

  const canCreate = await hasPermission(routePermissions.admin.servers.create);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-2 justify-between items-end">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">Manage Servers</h1>
          <h4 className="text-muted-foreground">
            Here you can manage your servers, add new ones, and edit existing
            server details.
          </h4>
        </div>
      </div>

      <PaginationTable
        createColumns={createColumns}
        fetchData={getServersPaginated}
        actions={
          canCreate && (
            <Modal>
              <AddServerModal />
              <Button>
                <IconPlus /> Add Server
              </Button>
            </Modal>
          )
        }
        filter
      />
    </div>
  );
}
