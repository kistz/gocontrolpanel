"use client";
import { getMapsPaginated } from "@/actions/database/map";
import { usePagination } from "@/hooks/use-pagination";
import { usePaginationAPI } from "@/hooks/use-pagination-api";
import { Maps } from "@/lib/prisma/generated";
import { PaginationResponse, ServerResponse } from "@/types/responses";
import { useEffect, useState } from "react";
import GridPagination from "../grid/grid-pagination";
import MapCard from "./map-card";

interface MapCardsProps {
  fetchData?: (
    pagination: {
      skip: number;
      limit: number;
    },
    sorting: {
      field: string;
      order: string;
    },
  ) => Promise<ServerResponse<PaginationResponse<Maps>>>;
}

export default function MapCards({
  fetchData = getMapsPaginated,
}: MapCardsProps) {
  const [cols, setCols] = useState(3);
  const [rows, setRows] = useState(2);
  const { pagination, setPagination, skip, limit } = usePagination(cols * rows);
  const { data, totalCount, loading, refetch } = usePaginationAPI(fetchData, {
    skip,
    limit,
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCols(1);
        setRows(2);
      } else if (window.innerWidth < 1536) {
        setCols(2);
        setRows(2);
      } else {
        setCols(3);
        setRows(2);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setPagination((prev) => {
      const maxPageIndex = Math.floor(totalCount / (cols * rows));
      const newPageIndex = Math.min(prev.pageIndex, maxPageIndex);
      return {
        pageSize: cols * rows,
        pageIndex: newPageIndex,
      };
    });
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cols, rows]);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 grid-rows-2">
        {data.map((map) => (
          <MapCard map={map} key={map.id} refetch={refetch} />
        ))}
        {!loading && data.length === 0 && (
          <div className="col-span-full flex items-center justify-center">
            <p>No maps found</p>
          </div>
        )}
      </div>
      <GridPagination
        pagination={pagination}
        setPagination={setPagination}
        pageCount={Math.ceil(totalCount / pagination.pageSize)}
      />
    </div>
  );
}
