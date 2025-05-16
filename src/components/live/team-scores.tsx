import { formatTime } from "@/lib/utils";
import { LiveInfo } from "@/types/live";

interface TeamScoresProps {
  liveInfo: LiveInfo;
}

export default function TeamScores({ liveInfo }: TeamScoresProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 w-full">
        {liveInfo.teams &&
          Object.values(liveInfo.teams).map((team) => (
            <div
              key={team.id}
              className="flex flex-1 flex-col gap-2 items-center"
            >
              <span
                className="text-3xl font-bold"
                style={{
                  color: team.name.toLowerCase(),
                }}
              >
                {team.name}
              </span>
              <span className="text-3xl font-bold">{team.matchPoints}</span>

              {liveInfo.players &&
                Object.values(liveInfo.players)
                  .filter((player) => player.team === team.id)
                  .map((player) => (
                    <div key={player.login} className="flex gap-2 items-center">
                      <span
                        className="text-lg font-bold"
                        style={{
                          color: player.name.toLowerCase(),
                        }}
                      >
                        {player.name}
                      </span>
                      <span className="text-lg font-bold">
                        {player.matchPoints}
                      </span>
                      <span className="text-lg font-bold">
                        {formatTime(player.bestTime)}
                      </span>
                    </div>
                  ))}
            </div>
          ))}
      </div>
    </div>
  );
}
