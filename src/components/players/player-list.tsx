"use client";

import { createColumns } from "@/app/(gocontroller)/server/[id]/players/players-columns";
import { PlayerInfo } from "@/types/player";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { DataTable } from "../table/data-table";

interface PlayerListProps {
  serverId: string;
}

export default function PlayerList({ serverId }: PlayerListProps) {
  const { status } = useSession();
  const [playerList, setPlayerList] = useState<PlayerInfo[]>([]);

  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (status !== "authenticated") return;

    const ws = new WebSocket(`/api/ws/players/${serverId}`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case "playerList":
          setPlayerList(data.data as PlayerInfo[]);
          break;
        case "playerInfo":
          setPlayerList((prev) =>
            prev.map((player) =>
              player.login === data.data.login
                ? { ...player, ...data.data }
                : player,
            ),
          );
          break;
        case "playerConnect":
          setPlayerList((prev) => [...prev, data.data as PlayerInfo]);
          break;
        case "playerDisconnect":
          setPlayerList((prev) =>
            prev.filter((player) => player.login !== data.data.login),
          );
          break;
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
  }, [status, serverId]);

  const columns = createColumns(serverId);

  return <DataTable columns={columns} data={playerList} pagination />;
}
