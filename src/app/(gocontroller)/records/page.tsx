import { getRecordsPaginated } from "@/actions/database/record";
import { PaginationTable } from "@/components/table/pagination-table";
import { createColumns } from "./columns";

export default function RecordsPage() {
  return (
    <PaginationTable
      createColumns={createColumns}
      fetchData={getRecordsPaginated}
    />
  );
}
