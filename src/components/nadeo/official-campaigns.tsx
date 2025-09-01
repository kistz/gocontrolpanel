"use client";
import { Campaign } from "@/types/api/nadeo";
import { DataTable } from "../table/data-table";
import { createColumns } from "./official-campaigns-columns";

export default function OfficialCampaigns({
  serverId,
  campaigns,
  type = "seasonal",
}: {
  serverId: string;
  campaigns: Campaign[];
  type?: "seasonal" | "shorts";
}) {
  const columns = createColumns(serverId, type);

  return <DataTable columns={columns} data={campaigns} />;
}
