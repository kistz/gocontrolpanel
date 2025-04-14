import { getMapList } from "@/actions/database/map";
import MapOrder from "@/components/maps/map-order";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function ServerMapsPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;

  const maps = await getMapList(id);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Manage Server Maps</h1>
        <h4 className="text-muted-foreground">
          Manage the maps of the server and their order.
        </h4>
      </div>
      <Tabs defaultValue="maps" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger
            value="maps"
            className="cursor-pointer data-[state=active]:bg-white dark:data-[state=active]:bg-black"
          >
            Server Maps
          </TabsTrigger>
          <TabsTrigger
            value="jukebox"
            className="cursor-pointer data-[state=active]:bg-white dark:data-[state=active]:bg-black"
          >
            Jukebox
          </TabsTrigger>
        </TabsList>
        <TabsContent value="maps" className="flex flex-col gap-6">
          <MapOrder mapList={maps} serverId={id} />
        </TabsContent>
        <TabsContent value="jukebox" className="flex flex-col gap-6">
          <div>jukebox</div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
