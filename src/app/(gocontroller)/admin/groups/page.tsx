import { getGroupsPaginated } from "@/actions/database/groups";
import { getAllUsers } from "@/actions/database/users";
import { getServers } from "@/actions/gbxconnector/servers";
import AddGroupModal from "@/components/modals/add-group";
import Modal from "@/components/modals/modal";
import { PaginationTable } from "@/components/table/pagination-table";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import { createColumns } from "./columns";

export default async function AdminGroupsPage() {
  const { data: servers } = await getServers();
  const { data: users } = await getAllUsers();
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

        <Modal>
          <AddGroupModal
            data={{
              servers,
              users,
            }}
          />
          <Button>
            <IconPlus /> Add Group
          </Button>
        </Modal>
      </div>

      <PaginationTable
        key={key}
        createColumns={createColumns}
        args={{
          servers,
          users,
        }}
        fetchData={getGroupsPaginated}
      />
    </div>
  );
}

export const dynamic = "force-dynamic";
