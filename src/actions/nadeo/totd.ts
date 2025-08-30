"use server";

import { doServerActionWithAuth } from "@/lib/actions";
import { getTotdRoyalMaps } from "@/lib/api/nadeo";
import { MonthMapListWithDayMaps } from "@/types/api/nadeo";
import { ServerResponse } from "@/types/responses";
import { getMapsByUids } from "../database/maps";

export async function getTotdMonth(
  serverId: string,
  offset: number,
): Promise<ServerResponse<MonthMapListWithDayMaps | null>> {
  return doServerActionWithAuth(
    [`servers:${serverId}:moderator`, `servers:${serverId}:admin`],
    async () => {
      const mapListResponse = await getTotdRoyalMaps(1, offset);

      const monthList = mapListResponse.monthList?.[0];

      if (!monthList) {
        return null;
      }

      const { data: maps, error } = await getMapsByUids(
        monthList.days.map((m) => m.mapUid).filter(Boolean),
      );
      if (error) {
        throw new Error(error);
      }

      return {
        ...monthList,
        days: monthList.days
          .map((day) => ({
            ...day,
            map: maps.find((m) => m.uid === day.mapUid),
          }))
          .filter((day) => day.map !== undefined)
          .map((day) => ({
            ...day,
            // TypeScript: map is guaranteed to be defined after filter
            map: day.map!,
          })),
      };
    },
  );
}
