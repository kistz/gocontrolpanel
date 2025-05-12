"use client";

import { getBlacklist } from "@/actions/gbx/player";
import { createColumns } from "@/app/(gocontroller)/server/[id]/players/blacklist-columns";
import { getErrorMessage } from "@/lib/utils";
import { PlayerInfo } from "@/types/player";
import { useState } from "react";
import { toast } from "sonner";
import { DataTable } from "../table/data-table";

interface BlacklistListProps {
  serverId: number;
  defaultBlacklist: PlayerInfo[];
}

export default function BlacklistList({
  serverId,
  defaultBlacklist,
}: BlacklistListProps) {
  const [blacklist, setBlacklist] = useState<PlayerInfo[]>(defaultBlacklist);

  const refetch = async () => {
    try {
      const { data, error } = await getBlacklist(serverId);
      if (error) {
        throw new Error(error);
      }

      setBlacklist(data);
    } catch (error) {
      toast.error("Error fetching blacklist", {
        description: getErrorMessage(error),
      });
    }
  };

  const columns = createColumns(serverId, refetch);

  return <DataTable columns={columns} data={blacklist} pagination />;
}
