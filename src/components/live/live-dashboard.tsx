"use client";
import { getPlayerList } from "@/actions/gbx/player";
import { getErrorMessage, hasPermissionSync } from "@/lib/utils";
import { LiveInfo } from "@/types/live";
import { PlayerInfo } from "@/types/player";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Card } from "../ui/card";
import KnockoutScores from "./knockout-scores";
import LiveRound from "./live-round";
import MapInfo from "./mapinfo";
import MatchSettings from "./match-settings";
import Rankings from "./rankings";
import RoundScores from "./round-scores";
import TeamScores from "./team-scores";
import TimeAttackScores from "./time-attack-scores";
import { routePermissions } from "@/routes";

export default function LiveDashboard({ serverId }: { serverId: string }) {
  const { data: session, status } = useSession();

  const [playerList, setPlayerList] = useState<PlayerInfo[]>([]);
  const [liveInfo, setLiveInfo] = useState<LiveInfo | null>(null);
  const [mapInfo, setMapInfo] = useState<{
    map: string;
    mode: string;
  } | null>(null);

  const wsRef = useRef<WebSocket | null>(null);

  const canActions = hasPermissionSync(
    session,
    routePermissions.servers.live.actions,
    serverId,
  );

  useEffect(() => {
    if (status !== "authenticated") return;

    const ws = new WebSocket(`/api/ws/live/${serverId}`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case "beginMatch": {
          const { info } = data.data;
          setLiveInfo(info);
          setMapInfo({
            map: info.currentMap,
            mode: info.mode,
          });
          break;
        }
        case "finish": {
          const { round } = data.data;
          setLiveInfo((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              activeRound: round,
            };
          });
          break;
        }
        case "personalBest": {
          const { info } = data.data;
          setLiveInfo(info);
          break;
        }
        case "checkpoint": {
          const { round } = data.data;
          setLiveInfo((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              activeRound: round,
            };
          });
          break;
        }
        case "beginRound": {
          const { round } = data.data;
          setLiveInfo((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              activeRound: round,
            };
          });
          break;
        }
        case "endRound": {
          const { info } = data.data;
          setLiveInfo(info);
          break;
        }
        case "beginMap": {
          const { mapUid } = data.data;
          setMapInfo((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              map: mapUid,
            };
          });
          break;
        }
        case "endMap": {
          const { mapUid } = data.data;
          setMapInfo((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              map: mapUid,
            };
          });
          break;
        }
        case "giveUp": {
          const { round } = data.data;
          setLiveInfo((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              activeRound: round,
            };
          });
          break;
        }
        case "warmUpStart": {
          const { info } = data.data;
          setLiveInfo(info);
          break;
        }
        case "warmUpEnd": {
          const { info } = data.data;
          setLiveInfo(info);
          break;
        }
        case "warmUpStartRound": {
          const { info } = data.data;
          setLiveInfo(info);
          break;
        }
        case "playerInfoChanged": {
          const { round } = data.data;
          setLiveInfo((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              activeRound: round,
            };
          });
          break;
        }
        case "playerConnect": {
          const { live } = data.data;
          setLiveInfo(live);
          break;
        }
        case "playerDisconnect": {
          const { round } = data.data;
          setLiveInfo((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              activeRound: round,
            };
          });
          break;
        }
        case "updatedSettings": {
          const { info } = data.data;
          setLiveInfo(info);
          break;
        }
        case "elimination": {
          const { info } = data.data;
          setLiveInfo(info);
          break;
        }
      }
    };

    ws.onclose = () => {
      wsRef.current = null;
    };

    ws.onerror = () => {
      ws.close();
    };

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [serverId, status]);

  useEffect(() => {
    if (!liveInfo?.players) {
      return;
    }

    const fetchData = async () => {
      try {
        const { data, error } = await getPlayerList(serverId);
        if (error) {
          throw new Error(error);
        }

        setPlayerList(data);
      } catch (error) {
        toast.error("Error fetching player list", {
          description: getErrorMessage(error),
        });
      }
    };

    fetchData();
  }, [liveInfo?.players]);

  if (!liveInfo) {
    return <div className="text-sm">Loading...</div>;
  }

  return (
    <div className="grid w-full gap-4 grid-cols-1 min-[1200px]:grid-cols-2 min-[1528px]:grid-cols-[auto_1fr_auto]">
      <LiveRound
        activeRound={liveInfo.activeRound}
        playerList={playerList}
        isWarmUp={liveInfo.isWarmUp}
        warmUpRound={liveInfo.warmUpRound}
        warmUpTotalRounds={liveInfo.warmUpTotalRounds}
        isPaused={liveInfo.isPaused}
      />

      <div className="flex flex-col gap-4">
        <Card className="flex flex-col gap-2 p-4 flex-1">
          {!["timeattack"].includes(liveInfo.type) && (
            <MatchSettings
              pointsLimit={liveInfo.pointsLimit}
              roundsLimit={liveInfo.roundsLimit}
              mapLimit={liveInfo.mapLimit}
              nbWinners={liveInfo.nbWinners}
            />
          )}

          {["teams", "tmwt", "tmwc"].includes(liveInfo.type) && (
            <TeamScores liveInfo={liveInfo} />
          )}
          {["rounds", "cup"].includes(liveInfo.type) && (
            <RoundScores liveInfo={liveInfo} />
          )}
          {["timeattack"].includes(liveInfo.type) && (
            <TimeAttackScores liveInfo={liveInfo} />
          )}
          {["knockout"].includes(liveInfo.type) && (
            <KnockoutScores liveInfo={liveInfo} />
          )}
        </Card>
      </div>

      <div className="flex flex-col min-[1200px]:flex-row min-[1528px]:flex-col gap-4">
        <MapInfo
          serverId={serverId}
          map={mapInfo?.map}
          mode={mapInfo?.mode}
          pauseAvailable={liveInfo.pauseAvailable}
          isPaused={liveInfo.isPaused}
          isWarmUp={liveInfo.isWarmUp}
          canActions={canActions}
        />
        <Rankings
          players={liveInfo.players}
          teams={liveInfo.teams}
          type={liveInfo.type}
        />
      </div>
    </div>
  );
}
