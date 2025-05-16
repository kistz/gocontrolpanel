import { formatTime } from "@/lib/utils";
import { ActiveRound } from "@/types/live";
import { PlayerInfo } from "@/types/player";

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
    <div className="flex flex-1 flex-col gap-2 items-center">
      {!isWarmUp && (
        <div className="flex gap-2 items-center">
          <span className="text-3xl font-bold text-warmup">
            {warmUpRound} / {warmUpTotalRounds}
          </span>
        </div>
      )}

      {activeRound.players &&
        Object.values(activeRound.players)
          .sort((a, b) => {
            if (b.checkpoint !== a.checkpoint) {
              return b.checkpoint - a.checkpoint;
            }
            return a.time - b.time;
          })
          .map((player, i) => (
            <div key={player.login} className="flex gap-2 items-center">
              <span
                className="text-3xl font-bold"
                style={{
                  color: player.hasFinished ? "green" : "red",
                }}
              >
                {i + 1}
              </span>
              <span className="text-lg font-bold">
                {playerList.find((p) => p.login === player.login)?.nickName ||
                  player.login}
              </span>
              <span className="text-lg font-bold">{player.checkpoint}</span>
              <span className="text-lg font-bold">
                {player.hasGivenUp ? (
                  <span className="text-red-500">Gave Up</span>
                ) : (
                  formatTime(player.time)
                )}
              </span>
            </div>
          ))}
    </div>
  );
}
