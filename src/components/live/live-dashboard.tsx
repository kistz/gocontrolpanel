"use client";
import { LiveInfo } from "@/types/live";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

export default function LiveDashboard({ serverId }: { serverId: number }) {
  const { data: session } = useSession();

  const [liveInfo, setLiveInfo] = useState<LiveInfo | null>(null);
  const [currentMap, setCurrentMap] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!session) {
      return;
    }

    const baseUlr = process.env.NEXT_PUBLIC_CONNECTOR_URL;
    if (!baseUlr) {
      console.error("Connector URL is not defined");
      return;
    }

    const socket = new WebSocket(
      `${baseUlr}/ws/live/${serverId}?token=${session.jwt}`,
    );
    wsRef.current = socket;

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);

        // Returns LiveInfo
        if (message.beginMatch) {
          setLiveInfo(message.beginMatch);
        }

        // Returns ActiveRound
        if (message.finish) {
          setLiveInfo((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              activeRound: message.finish,
            };
          });
        }

        // Returns ActiveRound
        if (message.checkpoint) {
          setLiveInfo((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              activeRound: message.checkpoint,
            };
          });
        }

        // Returns LiveInfo
        if (message.endRound) {
          setLiveInfo(message.endRound);
        }

        // Returns string
        if (message.beginMap) {
          setCurrentMap(message.beginMap);
        }

        // Returns string
        if (message.endMap) {
          setCurrentMap(message.endMap);
        }

        // Returns ActiveRound
        if (message.giveUp) {
          setLiveInfo((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              activeRound: message.giveUp,
            };
          });
        }

        // Returns ActiveRound
        if (message.beginRound) {
          setLiveInfo((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              activeRound: message.beginRound,
            };
          });
        }
      } catch {
        console.error("Failed to parse message", event.data);
      }
    };

    return () => {
      socket.close();
    };
  }, [serverId, session]);

  if (!liveInfo) {
    return <div className="text-sm text-gray-500">Loading...</div>;
  }

  return (
    <div className="flex gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-bold">
          Current Map: {liveInfo.currentMap}
        </h2>
        <p>Mode: {liveInfo.mode}</p>
        <p>Warmup: {liveInfo.isWarmup ? "Yes" : "No"}</p>
        <p>Points Limit: {liveInfo.pointsLimit}</p>
        <p>Rounds Limit: {liveInfo.roundsLimit}</p>
        <p>Map Limit: {liveInfo.mapLimit}</p>
        <h3 className="text-md font-semibold">Maps:</h3>
        <ul className="list-disc pl-5">
          {liveInfo.maps.map((map, index) => (
            <li key={index}>{map}</li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className="text-lg font-bold">Teams:</h2>
        <ul className="list-disc pl-5">
          {liveInfo.teams &&
            Object.values(liveInfo.teams).map((team) => (
              <li key={team.id}>
                {team.name} - Round Points: {team.roundPoints}, Match Points:{" "}
                {team.matchPoints}
              </li>
            ))}
        </ul>
      </div>
      <div>
        <h2 className="text-lg font-bold">Players:</h2>
        <ul className="list-disc pl-5">
          {liveInfo.players &&
            Object.values(liveInfo.players).map((player) => (
              <li key={player.login}>
                {player.name} - Team: {player.team}, Round Points:{" "}
                {player.roundPoints}, Match Points: {player.matchPoints}
              </li>
            ))}
        </ul>
      </div>
      <div>
        <h2 className="text-lg font-bold">Active Round:</h2>
        <ul className="list-disc pl-5">
          {liveInfo.activeRound.players &&
            Object.values(liveInfo.activeRound.players).map((player) => (
              <li key={player.login}>
                {player.login} - Time: {player.time}, Checkpoint:{" "}
                {player.checkpoint}, Finished:{" "}
                {player.hasFinished ? "Yes" : "No"}
                {player.hasGivenUp ? " (Gave Up)" : ""}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
