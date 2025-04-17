import { getPlayersPaginated } from "@/actions/database/player";
import { PaginationTable } from "@/components/table/pagination-table";
import { createColumns } from "./columns";

export default function PlayersPage() {
  return (
    <PaginationTable
      createColumns={createColumns}
      fetchData={getPlayersPaginated}
      filter={true}
    />
  );
}
