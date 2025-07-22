"use client";

import { createColumns } from "@/app/(gocontroller)/server/[id]/players/players-columns";
import useWebSocket from "@/hooks/use-websocket";
import { PlayerInfo } from "@/types/player";
import { useSession } from "next-auth/react";
import { useCallback, useRef, useState } from "react";
import { DataTable } from "../table/data-table";

interface PlayerListProps {
  serverId: string;
}

export default function PlayerList({ serverId }: PlayerListProps) {
  const { status } = useSession();
  const [playerList, setPlayerList] = useState<PlayerInfo[]>([]);

  const wsRef = useRef<WebSocket | null>(null);

  const handleMessage = useCallback((type: string, data: any) => {
    switch (type) {
      case "playerList":
        setPlayerList(data);
        break;
      case "playerInfo":
        setPlayerList((prev) =>
          prev.map((player) =>
            player.login === data.login ? { ...player, ...data } : player,
          ),
        );
        break;
      case "playerConnect":
        setPlayerList((prev) => [...prev, data]);
        break;
      case "playerDisconnect":
        setPlayerList((prev) =>
          prev.filter((player) => player.login !== data.login),
        );
        break;
    }
  }, []);

  useWebSocket({
    url: `/api/ws/players/${serverId}`,
    onMessage: handleMessage,
  });

  const columns = createColumns(serverId);

  return <DataTable columns={columns} data={playerList} pagination />;
}
