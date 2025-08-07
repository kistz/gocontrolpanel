import MapSearch from "@/components/tmx/mapsearch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { hasPermission } from "@/lib/auth";
import { getFileManagerHealth } from "@/lib/filemanager";
import { routePermissions, routes } from "@/routes";
import { redirect } from "next/navigation";

export default async function ServerTMXPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const canView = await hasPermission(routePermissions.servers.tmx, id);
  if (!canView) {
    redirect(routes.dashboard);
  }

  let fmHealth = false;
  try {
    fmHealth = await getFileManagerHealth(id);
  } catch (err) {
    console.error("Failed to fetch file manager:", err);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Search TrackmaniaExchange</h1>
        <h4 className="text-muted-foreground">
          Search for maps or mappacks from TrackmaniaExchange and add them to
          your server.
        </h4>
      </div>
      <Tabs defaultValue="maps" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="maps">Maps</TabsTrigger>
          <TabsTrigger value="mappacks">Mappacks</TabsTrigger>
        </TabsList>
        <TabsContent value="maps" className="flex flex-col gap-6">
          <MapSearch serverId={id} fmHealth={fmHealth} />
        </TabsContent>
        <TabsContent
          value="mappacks"
          className="flex flex-col gap-6"
        ></TabsContent>
      </Tabs>
    </div>
  );
}
