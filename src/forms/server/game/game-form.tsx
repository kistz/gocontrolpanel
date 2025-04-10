import { ModeScriptInfo } from "@/types/server";
import ScriptNameForm from "./script-name-form";
import ShowOpponentsForm from "./show-opponents-form";
import MatchSettingsForm from "./mode-settings-form";
import PlaylistForm from "./playlist-form";

interface GameFormProps {
  showOpponents: number;
  scriptName: string;
  modeScriptInfo: ModeScriptInfo;
  modeScriptSettings: Record<string, unknown>;
}

export default function GameForm({
  showOpponents,
  scriptName,
  modeScriptSettings,
}: GameFormProps) {
  return (
    <div className="flex flex-col gap-4 xl:flex-row">
      <div className="flex flex-col gap-4 flex-1">
        <ShowOpponentsForm showOpponents={showOpponents} />
        <ScriptNameForm scriptName={scriptName} />
        <MatchSettingsForm />
        <PlaylistForm />
      </div>

      <div className="flex flex-col gap-1 flex-1">
        <h2 className="text-lg font-semibold">Mode Script Settings</h2>
        <p className="text-sm text-muted-foreground">
          These settings are specific to the mode script and are not shared
          between modes. They are saved in the mode script file.
        </p>
      </div>
    </div>
  );
}
