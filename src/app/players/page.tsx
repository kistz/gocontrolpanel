import { Button } from "@/components/ui/button";
import { getAllPlayers } from "@/lib/database/player";

export default async function PlayersPage() {
  const players = await getAllPlayers();

  return (
    <div>
      <h1>Players</h1>
      <ul>
        {players.map((player) => (
          <li key={player._id.toString()}>
            {player.nickName} - {player.path}
          </li>
        ))}
        <Button>Test</Button>
      </ul>
    </div>
  );
}