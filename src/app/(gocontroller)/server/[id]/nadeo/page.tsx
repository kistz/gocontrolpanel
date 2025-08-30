import { getAllSeasonalCampaigns } from "@/actions/nadeo/campaigns";
import { getTotdMonth } from "@/actions/nadeo/totd";
import SeasonalCampaigns from "@/components/nadeo/seasonal-campaigns";
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
  searchParams: Promise<{ page?: string; offset?: string; campaign?: string }>;
}) {
  const { id } = await params;
  const { page = "totd", offset = "0", campaign } = await searchParams;

  const offsetInt = parseInt(offset);

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
  switch (page) {
    case "totd":
      const { data: totdMapList } = await getTotdMonth(id, offsetInt);
      mapList = totdMapList;
      break;
    case "seasonal":
      const { data: seasonalCampaignResponse } =
        await getAllSeasonalCampaigns();
      seasonalCampaignList = seasonalCampaignResponse;
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
          <SeasonalCampaigns
            serverId={id}
            fmHealth={fmHealth}
            seasonalCampaignList={seasonalCampaignList}
          />
        </TabsContent>

        <TabsContent
          value="shorts"
          className="flex flex-col gap-2"
        ></TabsContent>

        <TabsContent
          value="club-campaigns"
          className="flex flex-col gap-2"
        ></TabsContent>

        <TabsContent
          value="clubs"
          className="flex flex-col gap-2"
        ></TabsContent>
      </Tabs>
    </div>
  );
}
