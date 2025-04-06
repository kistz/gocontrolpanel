import { PaginationTable } from "@/components/table/pagination-table";
import { getPlayersPaginated } from "@/database/player";
import { createColumns } from "./columns";

export default async function PlayersPage() {
  return (
    <PaginationTable
      createColumns={createColumns}
      fetchData={getPlayersPaginated}
    />
  );
}
