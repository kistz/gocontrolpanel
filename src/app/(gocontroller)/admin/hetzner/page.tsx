import { getHetznerProjectsPaginated } from "@/actions/database/hetzner-projects";
import { getAllUsers } from "@/actions/database/users";
import AddProjectModal from "@/components/modals/add-project";
import Modal from "@/components/modals/modal";
import { PaginationTable } from "@/components/table/pagination-table";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import { createColumns } from "./columns";

export default async function AdminHetznerPage() {
  const { data: users } = await getAllUsers();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-2 justify-between sm:items-end">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">Manage Hetzner Projects</h1>
          <h4 className="text-muted-foreground">
            Manage your Hetzner projects and cloud servers.
          </h4>
        </div>

        <Modal>
          <AddProjectModal data={{ users }} />
          <Button>
            <IconPlus /> Add Project
          </Button>
        </Modal>
      </div>

      <PaginationTable
        fetchData={getHetznerProjectsPaginated}
        createColumns={createColumns}
        args={{
          users,
        }}
      />
    </div>
  );
}
