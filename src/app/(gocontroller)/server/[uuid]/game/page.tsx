import { getMapList } from "@/actions/database/maps";
import { getScripts } from "@/actions/filemanager";
import {
  getModeScriptInfo,
  getModeScriptSettings,
  getScriptName,
  getShowOpponents,
} from "@/actions/gbx/game";
import { getCurrentMapIndex } from "@/actions/gbx/map";
import MapCarousel from "@/components/maps/map-carousel";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MatchSettingsForm from "@/forms/server/game/match-settings-form";
import ModeScriptSettingsForm from "@/forms/server/game/mode-script-settings-form";
import PlaylistForm from "@/forms/server/game/playlist-form";
import ScriptNameForm from "@/forms/server/game/script-name-form";
import ShowOpponentsForm from "@/forms/server/game/show-opponents-form";
import { parseTmTags } from "tmtags";

export default async function ServerGamePage({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;

  const { data: mapList } = await getMapList(uuid);
  const { data: currentIndex } = await getCurrentMapIndex(uuid);

  const { data: scripts } = await getScripts(uuid);

  const { data: showOpponents } = await getShowOpponents(uuid);
  const { data: scriptName } = await getScriptName(uuid);
  const { data: modeScriptInfo } = await getModeScriptInfo(uuid);
  const { data: modeScriptSettings } = await getModeScriptSettings(uuid);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Manage Game</h1>
        <h4 className="text-muted-foreground">
          Manage general game settings, including map rotation, script settings
          and gamemodes.
        </h4>
      </div>

      <Tabs defaultValue="map" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="map">Map Rotation</TabsTrigger>
          <TabsTrigger value="script">Script Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="map" className="flex flex-col gap-6">
          <MapCarousel
            serverUuid={uuid}
            maps={mapList}
            startIndex={currentIndex}
            loop={true}
            className="w-full"
          />

          <Card className="p-6">
            <div className="flex gap-6 flex-col min-[960px]:flex-row">
              <div className="flex flex-col gap-4 flex-1">
                <ShowOpponentsForm
                  serverUuid={uuid}
                  showOpponents={showOpponents.NextValue}
                />
                <ScriptNameForm
                  serverUuid={uuid}
                  scriptName={scriptName.NextValue}
                  scripts={scripts}
                />
              </div>
              <div className="flex flex-col gap-4 flex-1">
                <MatchSettingsForm serverUuid={uuid} />
                <PlaylistForm serverUuid={uuid} />
              </div>
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="script">
          <Card className="p-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2 min-[960px]:w-1/2">
                <div className="flex flex-col">
                  <h2 className="text-lg font-bold">Mode Script Settings </h2>
                  <p className="text-base text-muted-foreground font-medium truncate">
                    ({modeScriptInfo.Name})
                  </p>
                </div>
                <p
                  className="text-base"
                  dangerouslySetInnerHTML={{
                    __html: parseTmTags(modeScriptInfo.Description),
                  }}
                />
              </div>

              <ModeScriptSettingsForm
                serverUuid={uuid}
                modeScriptSettings={modeScriptSettings}
                modeScriptInfo={modeScriptInfo}
              />
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
