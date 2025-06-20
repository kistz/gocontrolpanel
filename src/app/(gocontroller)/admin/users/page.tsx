import { getUsersPaginated } from "@/actions/database/users";
import { PaginationTable } from "@/components/table/pagination-table";
import { createColumns } from "./columns";

export default async function AdminUsersPage() {
  return (
    <PaginationTable
      createColumns={createColumns}
      fetchData={getUsersPaginated}
      filter={true}
    />
  );
}
