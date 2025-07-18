import { getUsersPaginated } from "@/actions/database/users";
import { PaginationTable } from "@/components/table/pagination-table";
import { withAuth } from "@/lib/auth";
import { routes } from "@/routes";
import { redirect } from "next/navigation";
import { createColumns } from "./columns";

export default async function AdminUsersPage() {
  try {
    await withAuth(["app:admin"]);
  } catch {
    redirect(routes.dashboard);
  }

  return (
    <PaginationTable
      createColumns={createColumns}
      fetchData={getUsersPaginated}
      filter={true}
    />
  );
}
