import { PaginationTable } from "@/components/pagination-table";
import { getRecordsPaginated } from "@/database/record";
import { columns } from "./columns";

export default async function RecordsPage() {
  return <PaginationTable columns={columns} fetchData={getRecordsPaginated} />;
}
