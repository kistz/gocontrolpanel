import { DataTable } from "@/components/data-table";
import { getAllPlayers } from "@/database/player";
import { columns } from "./columns";

export default async function PlayersPage() {
  const players = await getAllPlayers();

  return <DataTable columns={columns} data={players} />;
}
