"use client";

import { createColumns } from "@/app/(gocontroller)/server/[id]/players/players-columns";
import { PlayerInfo } from "@/types/player";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { DataTable } from "../table/data-table";

interface PlayerListProps {
  serverId: number;
}

export default function PlayerList({ serverId }: PlayerListProps) {
  const { data: session } = useSession();
  const [playerList, setPlayerList] = useState<PlayerInfo[]>([]);

  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!session) {
      return;
    }

    const baseUrl = process.env.NEXT_PUBLIC_CONNECTOR_URL;
    if (!baseUrl) {
      console.error("NEXT_PUBLIC_CONNECTOR_URL is not defined");
      return;
    }

    const socket = new WebSocket(
      `${baseUrl}/ws/players/${serverId}?token=${session.jwt}`,
    );
    wsRef.current = socket;

    socket.onmessage = (event) => {
      try {
        const message: {
          [key: string]: any;
        } = JSON.parse(event.data);

        switch (Object.keys(message)[0]) {
          case "playerList":
            setPlayerList(message.playerList as PlayerInfo[]);
            break;
          case "infoChanged":
            setPlayerList((prev) =>
              prev.map((player) =>
                player.login === message.infoChanged.login
                  ? { ...player, ...message.infoChanged }
                  : player,
              ),
            );
            break;
          case "connect":
            setPlayerList((prev) => [...prev, message.connect as PlayerInfo]);
            break;
          case "disconnect":
            setPlayerList((prev) =>
              prev.filter((player) => player.login !== message.disconnect),
            );
            break;
        }
      } catch {
        console.error("Error parsing WebSocket message:", event.data);
      }
    };

    return () => {
      socket.close();
    };
  }, [session, serverId]);

  const columns = createColumns(serverId);

  return <DataTable columns={columns} data={playerList} pagination />;
}
