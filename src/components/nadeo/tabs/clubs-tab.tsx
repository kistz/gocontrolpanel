import { getClubCampaignWithMaps } from "@/actions/nadeo/clubs";
import ClubActivities from "../club-activities";
import ClubCampaignMaps from "../club-campaign-maps";
import Clubs from "../clubs";

export default async function ClubsTab({
  serverId,
  fmHealth,
  clubId,
  campaignId,
}: {
  serverId: string;
  fmHealth: boolean;
  clubId?: number;
  campaignId?: number;
}) {
  if (clubId && campaignId) {
    const { data } = await getClubCampaignWithMaps(clubId, campaignId);

    return (
      <ClubCampaignMaps
        serverId={serverId}
        fmHealth={fmHealth}
        campaign={data}
      />
    );
  } else if (clubId) {
    return <ClubActivities serverId={serverId} clubId={clubId} />;
  } else {
    return <Clubs serverId={serverId} />;
  }
}
