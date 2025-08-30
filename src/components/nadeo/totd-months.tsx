"use client";

import { getTotdMonth } from "@/actions/nadeo/totd";
import { getErrorMessage, monthNumberToName } from "@/lib/utils";
import { MonthMapListWithDayMaps } from "@/types/api/nadeo";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import NadeoMapCard from "./nadeo-map-card";

export default function TotdMonths({
  serverId,
  fmHealth,
  defaultMapList = null,
}: {
  serverId: string;
  fmHealth: boolean;
  defaultMapList?: MonthMapListWithDayMaps | null;
}) {
  const [mapList, setMapList] = useState<MonthMapListWithDayMaps | null>(
    defaultMapList,
  );
  const [offset, setOffset] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onGetMonth = async (newOffset: number) => {
    setOffset(newOffset);
    setLoading(true);

    try {
      const { data, error } = await getTotdMonth(serverId, newOffset);
      if (error) {
        throw new Error(error);
      }

      setError(null);
      setMapList(data);
    } catch (err) {
      setError(getErrorMessage(err));
      toast.error("Failed to fetch month", {
        description: getErrorMessage(err),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 justify-between">
        <h2 className="text-xl font-bold">
          {mapList ? monthNumberToName(mapList.month) : ""}
        </h2>

        <div className="flex gap-2">
          <Button onClick={() => onGetMonth(offset - 1)} variant={"outline"}>
            <IconArrowLeft />
            Previous
          </Button>
          <Button
            onClick={() => onGetMonth(offset + 1)}
            variant={"outline"}
            disabled={offset === 0}
          >
            Next
            <IconArrowRight />
          </Button>
        </div>
      </div>

      {error && <span>{error}</span>}

      {loading && <span>Loading...</span>}

      {mapList && !loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 gap-4">
          {mapList.days.map((day) => (
            <NadeoMapCard
              key={day.mapUid}
              serverId={serverId}
              fmHealth={fmHealth}
              map={day.map}
            />
          ))}
        </div>
      )}
    </div>
  );
}
