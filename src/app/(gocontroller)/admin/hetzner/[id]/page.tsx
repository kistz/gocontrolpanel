import {
  getHetznerServersPaginated,
  getRateLimit,
} from "@/actions/hetzner/servers";
import { PaginationTable } from "@/components/table/pagination-table";
import { Progress } from "@/components/ui/progress";
import { createColumns } from "./columns";
import AddHetznerServerModal from "@/components/modals/add-hetzner-server";
import Modal from "@/components/modals/modal";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: rateLimit } = await getRateLimit(id);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-2 justify-between sm:items-end">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">Hetzner Project</h1>
          <h4 className="text-muted-foreground">
            Manage your Hetzner servers for this project.
          </h4>
        </div>

        <div className="flex flex-col gap-1">
          <h4 className="text-sm text-muted-foreground">
            Rate Limit: {(rateLimit.limit - rateLimit.remaining)} /{" "}
            {rateLimit.limit}
          </h4>
          <Progress
            value={
              ((rateLimit.limit - rateLimit.remaining) / rateLimit.limit) * 100
            }
            className="w-32"
          />
        </div>
      </div>
      <PaginationTable
        createColumns={createColumns}
        args={{ projectId: id }}
        fetchData={getHetznerServersPaginated}
        fetchArgs={{ projectId: id }}
        filter
        actions={<Modal>
            <AddHetznerServerModal data={id} />
            <Button>
              <IconPlus /> Add Server
            </Button>
          </Modal>}
      />
    </div>
  );
}
