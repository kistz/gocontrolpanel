import { formatTime } from "@/lib/utils";
import { PlayerRound, Team } from "@/types/live";
import { IconHash, IconTrophy, IconTrophyFilled } from "@tabler/icons-react";
import { Card } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

interface RankingsProps {
  players?: Record<string, PlayerRound>;
  teams?: Record<number, Team>;
  type: string;
}

export default function Rankings({ players, teams, type }: RankingsProps) {
  return (
    <Card className="p-4">
      <h2 className="text-lg font-bold">Rankings</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[24px] font-bold">
              <IconHash size={14} />
            </TableHead>
            <TableHead className="font-bold">Player</TableHead>
            {["teams", "tmwc", "tmwt"].includes(type) && (
              <TableHead className="font-bold">Team</TableHead>
            )}
            {!["timeattack", "knockout"].includes(type) && (
              <TableHead className="font-bold">Points</TableHead>
            )}
            <TableHead className="font-bold">Best Time</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {players &&
            Object.values(players)
              .sort((a, b) => {
                if (b.matchPoints !== a.matchPoints) {
                  return b.matchPoints - a.matchPoints;
                }
                return a.bestTime - b.bestTime;
              })
              .map((player, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <span className="font-bold">{i + 1}</span>
                  </TableCell>
                  <TableCell>{player.name}</TableCell>
                  {["teams", "tmwt", "tmwc"].includes(type) && (
                    <TableCell>{teams && teams[player.team]?.name}</TableCell>
                  )}
                  {!["timeattack", "knockout"].includes(type) && (
                    <TableCell>
                      {player.winner ? (
                        <IconTrophyFilled size={20} />
                      ) : player.finalist ? (
                        <IconTrophy size={20} />
                      ) : (
                        <span>{player.matchPoints}</span>
                      )}
                    </TableCell>
                  )}
                  <TableCell>{formatTime(player.bestTime)}</TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </Card>
  );
}
