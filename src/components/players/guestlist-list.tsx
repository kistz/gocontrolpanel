"use client";

import { getGuestlist } from "@/actions/gbx/player";
import { createColumns } from "@/app/(gocontroller)/server/[id]/players/blacklist-columns";
import { getErrorMessage } from "@/lib/utils";
import { PlayerInfo } from "@/types/player";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DataTable } from "../table/data-table";

interface GuestlistListProps {
  serverId: number;
}

export default function GuestlistList({ serverId }: GuestlistListProps) {
  const [guestlist, setGuestlist] = useState<PlayerInfo[]>([]);

  useEffect(() => {
    refetch();
  }, [serverId]);

  const refetch = async () => {
    try {
      const { data, error } = await getGuestlist(serverId);
      if (error) {
        throw new Error(error);
      }

      setGuestlist(data);
    } catch (error) {
      toast.error("Error fetching guest list", {
        description: getErrorMessage(error),
      });
    }
  };

  const columns = createColumns(serverId, refetch);

  return <DataTable columns={columns} data={guestlist} pagination />;
}
