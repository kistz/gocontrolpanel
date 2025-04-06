import { PaginationTable } from "@/components/pagination-table";
import { getPlayersPaginated } from "@/database/player";
import { columns } from "./columns";

export default async function PlayersPage() {
  return <PaginationTable columns={columns} fetchData={getPlayersPaginated} />;
}
