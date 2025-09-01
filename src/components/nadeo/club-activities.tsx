import { getClubActivitiesPaginated } from "@/actions/nadeo/clubs";
import { PaginationTable } from "../table/pagination-table";
import { createColumns } from "./club-activities-columns";

export default function ClubActivities({
  serverId,
  clubId,
}: {
  serverId: string;
  clubId: number;
}) {
  return (
    <PaginationTable
      createColumns={createColumns}
      fetchData={getClubActivitiesPaginated}
      fetchArgs={clubId}
      args={serverId}
    />
  );
}
