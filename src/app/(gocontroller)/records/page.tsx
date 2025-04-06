import { PaginationTable } from "@/components/pagination-table";
import { getRecordsPaginated } from "@/database/record";
import { createColumns } from "./columns";

export default async function RecordsPage() {
  return <PaginationTable createColumns={createColumns} fetchData={getRecordsPaginated} />;
}
