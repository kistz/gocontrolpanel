"use client";
import { PaginationTable } from "@/components/table/pagination-table";
import { getPlayersPaginated } from "@/database/player";
import { useBreadcrumbs } from "@/providers/breadcrumb-provider";
import { useEffect } from "react";
import { createColumns } from "./columns";

export default function PlayersPage() {
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([{ label: "Players" }]);
  }, []);

  return (
    <PaginationTable
      createColumns={createColumns}
      fetchData={getPlayersPaginated}
    />
  );
}
