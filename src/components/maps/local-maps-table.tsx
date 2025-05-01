"use client";

import { getLocalMaps } from "@/actions/gbx/server";
import { createColumns as createLocalMapColumns } from "@/app/(gocontroller)/server/[id]/maps/local-maps-columns";
import { LocalMapInfo } from "@/types/map";
import { useEffect, useState } from "react";
import { DataTable } from "../table/data-table";

export default function LocalMapsTable({ serverId }: { serverId: number }) {
  const [data, setData] = useState<LocalMapInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchLocalMaps() {
      const localMaps = await getLocalMaps(serverId);
      setData(localMaps);
      setIsLoading(false);
    }

    fetchLocalMaps();
  }, [serverId]);

  const columns = createLocalMapColumns(serverId);

  return (
    <DataTable
      data={data}
      columns={columns}
      isLoading={isLoading}
      filter={true}
    />
  );
}
