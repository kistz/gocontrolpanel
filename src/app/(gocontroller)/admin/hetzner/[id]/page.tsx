import { getHetznerServersPaginated } from "@/actions/hetzner/servers";
import { PaginationTable } from "@/components/table/pagination-table";
import { createColumns } from "./columns";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <PaginationTable
      createColumns={createColumns}
      fetchData={getHetznerServersPaginated}
      fetchArgs={{ projectId: id }}
      filter
    />
  );
}
