import { getMapList } from "@/actions/database/map";
import {
  getModeScriptInfo,
  getModeScriptSettings,
  getScriptName,
  getShowOpponents,
} from "@/actions/gbx/game";
import { getCurrentMapIndex } from "@/actions/gbx/map";
import MapCarousel from "@/components/maps/map-carousel";
import { Card } from "@/components/ui/card";
import GameForm from "@/forms/server/game/game-form";

export default async function ServerGamePage() {
  const mapList = await getMapList();
  const currentIndex = await getCurrentMapIndex();

  const showOpponents = await getShowOpponents();
  const scriptName = await getScriptName();
  const modeScriptInfo = await getModeScriptInfo();
  const modeScriptSettings = await getModeScriptSettings();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Manage Game</h1>
        <h4 className="text-muted-foreground">
          Manage general game settings, including map rotation and game mode.
        </h4>
      </div>

      <MapCarousel
        maps={mapList}
        startIndex={currentIndex}
        loop={true}
        className="max-w-max"
      />

      <Card className="p-6">
        <GameForm
          showOpponents={showOpponents.NextValue}
          scriptName={scriptName.NextValue}
          modeScriptInfo={modeScriptInfo}
          modeScriptSettings={modeScriptSettings}
        />
      </Card>
    </div>
  );
}
