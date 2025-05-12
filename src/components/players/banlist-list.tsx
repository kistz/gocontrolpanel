"use client";

import { getBanList } from "@/actions/gbx/player";
import { createColumns } from "@/app/(gocontroller)/server/[id]/players/banlist-columns";
import { getErrorMessage } from "@/lib/utils";
import { PlayerInfo } from "@/types/player";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DataTable } from "../table/data-table";

interface BanlistListProps {
  serverId: number;
}

export default function BanlistList({ serverId }: BanlistListProps) {
  const [banlist, setBanlist] = useState<PlayerInfo[]>([]);

  useEffect(() => {
    refetch();
  }, [serverId]);

  const refetch = async () => {
    try {
      const { data, error } = await getBanList(serverId);
      if (error) {
        throw new Error(error);
      }

      setBanlist(data);
    } catch (error) {
      toast.error("Error fetching banlist", {
        description: getErrorMessage(error),
      });
    }
  };

  const columns = createColumns(serverId, refetch);

  return <DataTable columns={columns} data={banlist} pagination />;
}
