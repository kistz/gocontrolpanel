"use client";

import { getClubActivitiesPaginated } from "@/actions/nadeo/clubs";
import { IconArrowLeft } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4">
      <Button variant="outline" onClick={() => router.back()} className="w-fit">
        <IconArrowLeft />
        Back
      </Button>

      <PaginationTable
        createColumns={createColumns}
        fetchData={getClubActivitiesPaginated}
        fetchArgs={clubId}
        args={serverId}
      />
    </div>
  );
}
