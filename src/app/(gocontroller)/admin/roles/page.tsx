import { getRolesPaginated } from "@/actions/database/roles";
import AddRoleModal from "@/components/modals/add-role";
import Modal from "@/components/modals/modal";
import { PaginationTable } from "@/components/table/pagination-table";
import { Button } from "@/components/ui/button";
import { hasPermission } from "@/lib/auth";
import { routePermissions, routes } from "@/routes";
import { IconPlus } from "@tabler/icons-react";
import { redirect } from "next/navigation";
import { createColumns } from "./columns";

export default async function AdminRolesPage() {
  const canView = await hasPermission(routePermissions.admin.roles.view);
  if (!canView) {
    redirect(routes.dashboard);
  }

  const canCreate = await hasPermission(routePermissions.admin.roles.create);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-2 justify-between sm:items-end">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">Manage Roles</h1>
          <h4 className="text-muted-foreground">
            Manage the roles and their permissions.
          </h4>
        </div>

        {canCreate && (
          <Modal>
            <AddRoleModal />
            <Button>
              <IconPlus /> Add Role
            </Button>
          </Modal>
        )}
      </div>

      <PaginationTable
        createColumns={createColumns}
        fetchData={getRolesPaginated}
        filter={true}
      />
    </div>
  );
}
