import { DataTable } from "@/components/data-table";
import { getAllPlayers } from "@/database/player";
import { columns } from "./columns";
import { getAllRecords } from "@/database/record";

export default async function RecordsPage() {
  const records = await getAllRecords();

  return <DataTable columns={columns} data={records} />;
}
