"use client";
import { PaginationTable } from "@/components/table/pagination-table";
import { getRecordsPaginated } from "@/database/record";
import { useBreadcrumbs } from "@/providers/breadcrumb-provider";
import { useEffect } from "react";
import { createColumns } from "./columns";

export default function RecordsPage() {
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([{ label: "Records" }]);
  }, []);

  return (
    <PaginationTable
      createColumns={createColumns}
      fetchData={getRecordsPaginated}
    />
  );
}
