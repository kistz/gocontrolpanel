import { PlayerRound, Team } from "@/types/live";

interface RankingsProps {
  players?: Record<string, PlayerRound>;
  teams?: Record<number, Team>;
}

export default function Rankings({ players, teams }: RankingsProps) {
  return (
    <div>
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
    </div>
  );
}
