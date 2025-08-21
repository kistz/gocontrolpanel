import { getMatchesPaginated } from "@/actions/database/matches";
import { PaginationTable } from "@/components/table/pagination-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { hasPermission } from "@/lib/auth";
import { routePermissions, routes } from "@/routes";
import { redirect } from "next/navigation";
import { createColumns } from "./columns";

export default async function ServerRecordsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const canView = await hasPermission(routePermissions.servers.records, id);
  if (!canView) {
    redirect(routes.dashboard);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Records</h1>
        <h4 className="text-muted-foreground">
          View and manage server records.
        </h4>
      </div>

      <Tabs defaultValue="matches" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="matches">Matches</TabsTrigger>
        </TabsList>

        <TabsContent value="matches" className="flex flex-col gap-2">
          <PaginationTable
            createColumns={createColumns}
            fetchData={getMatchesPaginated}
            fetchArgs={{ serverId: id }}
            filter
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
