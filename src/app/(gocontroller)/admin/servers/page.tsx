import { getServersPaginated } from "@/actions/database/servers";
import { getRecentlyCreatedHetznerServers } from "@/actions/hetzner/servers";
import { PaginationTable } from "@/components/table/pagination-table";
import { hasPermission } from "@/lib/auth";
import { routePermissions, routes } from "@/routes";
import { redirect } from "next/navigation";
import { createActions } from "./actions";
import { createColumns } from "./columns";

export default async function AdminServersPage() {
  const canView = await hasPermission(routePermissions.admin.servers.view);
  if (!canView) {
    redirect(routes.dashboard);
  }

  const canCreate = await hasPermission(routePermissions.admin.servers.create);
  const { data: recentlyCreatedServers } =
    await getRecentlyCreatedHetznerServers();

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
        actions={createActions}
        actionsAllowed={canCreate}
        actionsArgs={{ recentlyCreatedServers }}
        filter
      />
    </div>
  );
}
