import { getGroupsPaginated } from "@/actions/database/groups";
import AddGroupModal from "@/components/modals/add-group";
import Modal from "@/components/modals/modal";
import { PaginationTable } from "@/components/table/pagination-table";
import { Button } from "@/components/ui/button";
import { hasPermission } from "@/lib/auth";
import { routePermissions, routes } from "@/routes";
import { IconPlus } from "@tabler/icons-react";
import { redirect } from "next/navigation";
import { createColumns } from "./columns";
import { createActions } from "./actions";

export default async function AdminGroupsPage() {
  const canView = await hasPermission(routePermissions.admin.groups.view);
  if (!canView) {
    redirect(routes.dashboard);
  }

  const canCreate = await hasPermission(routePermissions.admin.groups.create);

  const key = crypto.randomUUID();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-2 justify-between sm:items-end">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">Manage Groups</h1>
          <h4 className="text-muted-foreground">
            Manage the groups and their members.
          </h4>
        </div>
      </div>

      <PaginationTable
        key={key}
        createColumns={createColumns}
        fetchData={getGroupsPaginated}
        actions={createActions}
        actionsAllowed={canCreate}
        filter
      />
    </div>
  );
}

export const dynamic = "force-dynamic";
