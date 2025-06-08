"use client";

import { getLocalMaps } from "@/actions/gbx/server";
import { createColumns as createLocalMapColumns } from "@/app/(gocontroller)/server/[uuid]/maps/local-maps-columns";
import { LocalMapInfo } from "@/types/map";
import { useEffect, useState } from "react";
import { DataTable } from "../table/data-table";

export default function LocalMapsTable({ serverUuid }: { serverUuid: string }) {
  const [data, setData] = useState<LocalMapInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchLocalMaps() {
      const { data } = await getLocalMaps(serverUuid);
      setData(data);
      setIsLoading(false);
    }

    fetchLocalMaps();
  }, [serverUuid]);

  const columns = createLocalMapColumns(serverUuid);

  return (
    <DataTable
      data={data}
      columns={columns}
      isLoading={isLoading}
      filter={true}
      pagination
    />
  );
}
