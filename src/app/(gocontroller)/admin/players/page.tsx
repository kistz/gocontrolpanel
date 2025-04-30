import { getPlayersPaginated } from "@/actions/database/player";
import { PaginationTable } from "@/components/table/pagination-table";
import { createColumns } from "./columns";

export default async function AdminPlayersPage() {
  return (
    <PaginationTable
      createColumns={createColumns}
      fetchData={getPlayersPaginated}
      filter={true}
    />
  );
}
