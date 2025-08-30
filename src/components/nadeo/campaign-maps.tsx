import { CampaignWithPlaylistMaps } from "@/types/api/nadeo";
import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";
import { Button } from "../ui/button";

export default function CampaignMaps({
  serverId,
  fmHealth,
  campaign,
}: {
  serverId: string;
  fmHealth: boolean;
  campaign?: CampaignWithPlaylistMaps | null;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 items-center">
        <Link href={`/server/${serverId}/nadeo?page=seasonal`}>
          <Button variant="outline">
            <IconArrowLeft />
            Back
          </Button>
        </Link>

        <h2 className="text-xl font-bold">{campaign?.name}</h2>
      </div>
    </div>
  );
}
