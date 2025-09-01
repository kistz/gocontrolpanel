import {
  getAllSeasonalCampaigns,
  getCampaignWithMaps,
} from "@/actions/nadeo/campaigns";
import { getClubCampaignWithMaps } from "@/actions/nadeo/clubs";
import { getAllWeeklyShorts } from "@/actions/nadeo/shorts";
import { getTotdMonth } from "@/actions/nadeo/totd";
import ClubActivities from "@/components/nadeo/club-activities";
import ClubCampaignCard from "@/components/nadeo/club-campaign-maps";
import ClubCampaigns from "@/components/nadeo/club-campaigns";
import Clubs from "@/components/nadeo/clubs";
import OfficialCampaignMaps from "@/components/nadeo/official-campaign-maps";
import OfficialCampaigns from "@/components/nadeo/official-campaigns";
import TotdMonths from "@/components/nadeo/totd-months";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { hasPermission } from "@/lib/auth";
import { getFileManagerHealth } from "@/lib/filemanager";
import { routePermissions, routes } from "@/routes";
import { redirect } from "next/navigation";

export default async function ServerNadeoPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    page?: string;
    offset?: string;
    campaign?: string;
    club?: string;
  }>;
}) {
  const { id } = await params;
  const { page = "totd", offset = "0", campaign, club } = await searchParams;

  const offsetInt = parseInt(offset);
  const campaignInt = campaign ? parseInt(campaign) : undefined;
  const clubInt = club ? parseInt(club) : undefined;

  const canView = await hasPermission(routePermissions.servers.nadeo, id);
  if (!canView) {
    redirect(routes.dashboard);
  }

  let fmHealth = false;
  try {
    fmHealth = await getFileManagerHealth(id);
  } catch (err) {
    console.error("Failed to fetch file manager:", err);
  }

  let mapList = undefined;
  let seasonalCampaignList = undefined;
  let selectedCampaign = undefined;
  let weeklyShortsList = undefined;
  let selectedWeeklyShorts = undefined;
  let selectedClubCampaign = undefined;
  switch (page) {
    case "totd":
      const { data: totdMapList } = await getTotdMonth(id, offsetInt);
      mapList = totdMapList;
      break;
    case "seasonal":
      const { data: seasonalCampaignResponse } =
        await getAllSeasonalCampaigns();
      seasonalCampaignList = seasonalCampaignResponse;
      if (campaign && seasonalCampaignList) {
        const sc = seasonalCampaignList.find(
          (c) => c.id.toString() === campaign,
        );
        if (sc) {
          const { data: campaignWithMaps } = await getCampaignWithMaps(sc);
          selectedCampaign = campaignWithMaps;
        }
      }
      break;
    case "shorts":
      const { data: weeklyShortsResponse } = await getAllWeeklyShorts();
      weeklyShortsList = weeklyShortsResponse;
      if (campaign && weeklyShortsList) {
        const wc = weeklyShortsList.find((c) => c.id.toString() === campaign);
        if (wc) {
          const { data: shortsWithMaps } = await getCampaignWithMaps(wc);
          selectedWeeklyShorts = shortsWithMaps;
        }
      }
      break;
    case "club-campaigns":
      if (campaignInt && clubInt) {
        const { data: clubCampaign } = await getClubCampaignWithMaps(
          clubInt,
          campaignInt,
        );
        selectedClubCampaign = clubCampaign;
      }
      break;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Nadeo</h1>
        <h4 className="text-muted-foreground">
          Search and download maps and campaigns from Nadeo servers.
        </h4>
      </div>

      <Tabs defaultValue="totd" className="w-full" withParam>
        <TabsList className="w-full">
          <TabsTrigger value="totd">Track of the Day</TabsTrigger>
          <TabsTrigger value="seasonal">Seasonal Campaigns</TabsTrigger>
          <TabsTrigger value="shorts">Weekly Shorts</TabsTrigger>
          <TabsTrigger value="club-campaigns">Club Campaigns</TabsTrigger>
          <TabsTrigger value="clubs">Clubs</TabsTrigger>
        </TabsList>

        <TabsContent value="totd" className="flex flex-col gap-2">
          <TotdMonths
            serverId={id}
            fmHealth={fmHealth}
            mapList={mapList}
            offset={offsetInt}
          />
        </TabsContent>

        <TabsContent value="seasonal" className="flex flex-col gap-2">
          {campaign ? (
            <OfficialCampaignMaps
              serverId={id}
              fmHealth={fmHealth}
              campaign={selectedCampaign}
            />
          ) : (
            seasonalCampaignList && (
              <OfficialCampaigns
                serverId={id}
                campaigns={seasonalCampaignList}
              />
            )
          )}
        </TabsContent>

        <TabsContent value="shorts" className="flex flex-col gap-2">
          {campaign ? (
            <OfficialCampaignMaps
              serverId={id}
              fmHealth={fmHealth}
              campaign={selectedWeeklyShorts}
            />
          ) : (
            weeklyShortsList && (
              <OfficialCampaigns
                serverId={id}
                campaigns={weeklyShortsList}
                type="shorts"
              />
            )
          )}
        </TabsContent>

        <TabsContent value="club-campaigns" className="flex flex-col gap-2">
          {campaignInt && clubInt ? (
            <ClubCampaignCard
              serverId={id}
              fmHealth={fmHealth}
              campaign={selectedClubCampaign}
            />
          ) : (
            <ClubCampaigns serverId={id} />
          )}
        </TabsContent>

        <TabsContent value="clubs" className="flex flex-col gap-2">
          {clubInt ? (
            campaignInt ? (
              <></>
            ) : (
              <ClubActivities serverId={id} clubId={clubInt} />
            )
          ) : (
            <Clubs serverId={id} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
