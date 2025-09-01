"use client";
import { Campaign } from "@/types/api/nadeo";
import { DataTable } from "../table/data-table";
import { createColumns } from "./seasonal-campaigns-columns";

export default function SeasonalCampaigns({
  serverId,
  seasonalCampaignList,
}: {
  serverId: string;
  seasonalCampaignList: Campaign[];
}) {
  const columns = createColumns(serverId);

  return <DataTable columns={columns} data={seasonalCampaignList} />;
}
