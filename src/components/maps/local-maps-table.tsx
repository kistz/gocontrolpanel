"use client";

import { getLocalMaps } from "@/actions/gbx/server";
import { createColumns as createLocalMapColumns } from "@/app/(gocontroller)/server/[uuid]/maps/local-maps-columns";
import { LocalMapInfo } from "@/types/map";
import { useEffect, useState } from "react";
import { DataTable } from "../table/data-table";

export default function LocalMapsTable({ id }: { id: string }) {
  const [data, setData] = useState<LocalMapInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchLocalMaps() {
      const { data } = await getLocalMaps(id);
      setData(data);
      setIsLoading(false);
    }

    fetchLocalMaps();
  }, [id]);

  const columns = createLocalMapColumns(id);

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
