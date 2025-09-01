import { getClubActivitiesPaginated } from "@/actions/nadeo/clubs";
import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";
import { PaginationTable } from "../table/pagination-table";
import { Button } from "../ui/button";
import { createColumns } from "./club-activities-columns";

export default function ClubActivities({
  serverId,
  clubId,
}: {
  serverId: string;
  clubId: number;
}) {
  return (
    <div className="flex flex-col gap-4">
      <Link href={`/server/${serverId}/nadeo?club=${clubId}`}>
        <Button variant="outline">
          <IconArrowLeft />
          Back
        </Button>
      </Link>

      <PaginationTable
        createColumns={createColumns}
        fetchData={getClubActivitiesPaginated}
        fetchArgs={clubId}
        args={serverId}
      />
    </div>
  );
}
