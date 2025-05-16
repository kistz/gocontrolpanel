import { formatTime } from "@/lib/utils";
import { ActiveRound } from "@/types/live";
import { PlayerInfo } from "@/types/player";
import { IconFlag, IconX } from "@tabler/icons-react";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import { Table, TableBody, TableCell, TableRow } from "../ui/table";

interface LiveRoundProps {
  activeRound: ActiveRound;
  playerList: PlayerInfo[];
  isWarmUp: boolean;
  warmUpRound?: number;
  warmUpTotalRounds?: number;
}

export default function LiveRound({
  activeRound,
  playerList,
  isWarmUp,
  warmUpRound,
  warmUpTotalRounds,
}: LiveRoundProps) {
  return (
    <Card className="flex flex-1 flex-col gap-2 items-center p-4">
      {isWarmUp && (
        <div className="flex gap-2 items-center">
          <span className="text-3xl font-bold text-warmup">
            {warmUpRound} / {warmUpTotalRounds}
          </span>
        </div>
      )}

      <Table className="flex justify-center">
        <TableBody>
          {activeRound.players &&
            [
              ...Object.values(activeRound.players),
              ...Object.values(activeRound.players),
              ...Object.values(activeRound.players),
              ...Object.values(activeRound.players),
              ...Object.values(activeRound.players),
              ...Object.values(activeRound.players),
              ...Object.values(activeRound.players),
              ...Object.values(activeRound.players),
              ...Object.values(activeRound.players),
              ...Object.values(activeRound.players),
            ]
              .sort((a, b) => {
                if (b.checkpoint !== a.checkpoint) {
                  return b.checkpoint - a.checkpoint;
                }
                return a.time - b.time;
              })
              .map((player, i) => (
                <TableRow key={i} className="flex gap-2 items-center">
                  <TableCell className="w-[50px]">
                    <Badge variant="outline" className="text-md font-bold">
                      {i + 1}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-lg">
                    {playerList.find((p) => p.login === player.login)
                      ?.nickName || player.login}
                  </TableCell>
                  <TableCell className="text-lg min-w-[92px] flex justify-end">
                    {formatTime(player.time)}
                  </TableCell>
                  <TableCell className="text-lg w-9 flex justify-center">
                    {player.hasFinished ? (
                      <IconFlag size={20} />
                    ) : player.hasGivenUp ? (
                      <IconX size={20} />
                    ) : (
                      <span>{player.checkpoint}</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </Card>
  );
}
