import { PlayerRound, Team } from "@/types/live";
import { Card } from "../ui/card";

interface RankingsProps {
  players?: Record<string, PlayerRound>;
  teams?: Record<number, Team>;
}

export default function Rankings({ players, teams }: RankingsProps) {
  return (
    <Card className="p-4">
      <h2 className="text-lg font-bold">Players:</h2>
      <ul className="list-disc pl-5">
        {players &&
          Object.values(players)
            .sort((a, b) => {
              if (b.matchPoints !== a.matchPoints) {
                return b.matchPoints - a.matchPoints;
              }
              return a.bestTime - b.bestTime;
            })
            .map((player) => (
              <li key={player.login}>
                {player.name} - Team: {player.team} Match Points:{" "}
                {player.matchPoints}
              </li>
            ))}
      </ul>
    </Card>
  );
}
