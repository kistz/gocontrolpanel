import { getAllPlayers } from "@/actions/database/player";

export default async function AdminPlayersPage() {
  const players = await getAllPlayers();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Players</h1>
      <p>Manage players here.</p>
    </div>
  );
}