"use client";
import { getPlayerList } from "@/actions/gbx/player";
import { getErrorMessage, initGbxWebsocketClient } from "@/lib/utils";
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

export default function LiveDashboard({ id }: { id: string }) {
  const { data: session } = useSession();

  const [playerList, setPlayerList] = useState<PlayerInfo[]>([]);
  const [liveInfo, setLiveInfo] = useState<LiveInfo | null>(null);
  const [mapInfo, setMapInfo] = useState<{
    map: string;
    mode: string;
  } | null>(null);

  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!session) {
      return;
    }

    const socket = initGbxWebsocketClient(
      `/ws/live/${id}`,
      session.jwt as string,
    );
    wsRef.current = socket;

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);

        if (message.beginMatch) {
          // Returns LiveInfo
          setLiveInfo(message.beginMatch);
          setMapInfo({
            map: message.beginMatch.currentMap,
            mode: message.beginMatch.mode,
          });
        } else if (message.finish) {
          // Returns ActiveRound
          setLiveInfo((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              activeRound: message.finish,
            };
          });
        } else if (message.personalBest) {
          // Returns LiveInfo
          setLiveInfo(message.personalBest);
        } else if (message.checkpoint) {
          // Returns ActiveRound
          setLiveInfo((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              activeRound: message.checkpoint,
            };
          });
        } else if (message.endRound) {
          // Returns LiveInfo
          setLiveInfo(message.endRound);
        } else if (message.beginMap) {
          // Returns string
          setMapInfo((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              map: message.beginMap,
            };
          });
        } else if (message.endMap) {
          // Returns string
          setMapInfo((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              map: message.endMap,
            };
          });
        } else if (message.giveUp) {
          // Returns ActiveRound
          setLiveInfo((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              activeRound: message.giveUp,
            };
          });
        } else if (message.beginRound) {
          // Returns ActiveRound
          setLiveInfo((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              activeRound: message.beginRound,
            };
          });
        } else if (message.warmUpStart) {
          // Returns LiveInfo
          setLiveInfo(message.warmUpStart);
        } else if (message.warmUpEnd) {
          // Returns LiveInfo
          setLiveInfo(message.warmUpEnd);
        } else if (message.warmUpStartRound) {
          // Returns LiveInfo
          setLiveInfo(message.warmUpStartRound);
        } else if (message.playerInfoChanged) {
          // Returns LiveInfo
          setLiveInfo((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              activeRound: message.playerInfoChanged,
            };
          });
        } else if (message.playerConnect) {
          // Returns LiveInfo
          setLiveInfo(message.playerConnect);
        } else if (message.playerDisconnect) {
          // Returns ActiveRound
          setLiveInfo((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              activeRound: message.playerDisconnect,
            };
          });
        } else if (message.updatedSettings) {
          // Returns LiveInfo
          setLiveInfo(message.updatedSettings);
        } else if (message.elimination) {
          // Returns LiveInfo
          setLiveInfo(message.elimination);
        }
      } catch {
        console.error("Failed to parse message", event.data);
      }
    };

    return () => {
      socket.close();
    };
  }, [id, session]);

  useEffect(() => {
    if (!liveInfo?.players) {
      return;
    }

    const fetchData = async () => {
      try {
        const { data, error } = await getPlayerList(id);
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
          id={id}
          map={mapInfo?.map}
          mode={mapInfo?.mode}
          pauseAvailable={liveInfo.pauseAvailable}
          isPaused={liveInfo.isPaused}
          isWarmUp={liveInfo.isWarmUp}
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
