import { getMapList } from "@/actions/database/map";
import { getJukebox } from "@/actions/gbx/map";
import Jukebox from "@/components/maps/jukebox";
import LocalMapsTable from "@/components/maps/local-maps-table";
import MapOrder from "@/components/maps/map-order";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getServers } from "@/lib/gbxclient";

export default async function ServerMapsPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;

  const maps = await getMapList(id);
  const jukebox = await getJukebox(id);
  const servers = await getServers();
  const isLocal = servers.find((s) => s.id == id)?.isLocal;

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

          {isLocal && <LocalMapsTable serverId={id} />}
        </TabsContent>
        <TabsContent value="jukebox" className="flex flex-col gap-6">
          <p className="text-muted-foreground">
            Note: If you have a seperate server controller running on this
            server, the jukeboxes might conflict.
          </p>

          <Jukebox serverId={id} jukebox={jukebox} maps={maps} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
