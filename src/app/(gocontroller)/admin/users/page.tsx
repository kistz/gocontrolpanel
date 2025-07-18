import { getUsersPaginated } from "@/actions/database/users";
import { PaginationTable } from "@/components/table/pagination-table";
import { withAuth } from "@/lib/auth";
import { routes } from "@/routes";
import { redirect } from "next/navigation";
import { createColumns } from "./columns";
import { getRoles } from "@/actions/database/roles";

export default async function AdminUsersPage() {
  try {
    await withAuth(["app:admin"]);
  } catch {
    redirect(routes.dashboard);
  }

  const { data: roles } = await getRoles();

  return (
    <PaginationTable
      createColumns={createColumns}
      args={{ roles }}
      fetchData={getUsersPaginated}
      filter={true}
    />
  );
}
