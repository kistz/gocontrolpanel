import { getRecordsPaginated } from "@/actions/record";
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
