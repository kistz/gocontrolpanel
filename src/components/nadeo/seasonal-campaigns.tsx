"use client";
import { Campaign } from "@/types/api/nadeo";
import { DataTable } from "../table/data-table";
import { createColumns } from "./seasonal-campaigns-columns";

export default function SeasonalCampaigns({
  serverId,
  seasonalCampaignList = null,
}: {
  serverId: string;
  seasonalCampaignList?: Campaign[] | null;
}) {
  if (!seasonalCampaignList) {
    return <div>No seasonal campaigns found.</div>;
  }

  const columns = createColumns(serverId);

  return <DataTable columns={columns} data={seasonalCampaignList} />;
}
