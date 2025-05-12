import PlayerList from "@/components/players/player-list";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";

export default async function ServerPlayersPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Server Players</h1>
        <h4 className="text-muted-foreground">Manage server players.</h4>
      </div>

      <Tabs defaultValue="players" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger
            value="players"
            className="cursor-pointer data-[state=active]:bg-white dark:data-[state=active]:bg-black"
          >
            Players
          </TabsTrigger>
          <TabsTrigger
            value="blacklist"
            className="cursor-pointer data-[state=active]:bg-white dark:data-[state=active]:bg-black"
          >
            Blacklist
          </TabsTrigger>
          <TabsTrigger
            value="guestlist"
            className="cursor-pointer data-[state=active]:bg-white dark:data-[state=active]:bg-black"
          >
            Guestlist
          </TabsTrigger>
        </TabsList>

        <TabsContent value="players" className="flex flex-col gap-6">
          <PlayerList serverId={id} />
        </TabsContent>
        <TabsContent value="blacklist" className="flex flex-col gap-6">
          blacklist
        </TabsContent>
        <TabsContent value="guestlist" className="flex flex-col gap-6">
          guestlist
        </TabsContent>
      </Tabs>
    </div>
  );
}
