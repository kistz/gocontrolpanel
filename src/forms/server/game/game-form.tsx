import { ModeScriptInfo } from "@/types/server";
import { parseTmTags } from "tmtags";
import MatchSettingsForm from "./match-settings-form";
import ModeScriptSettingsForm from "./mode-script-settings-form";
import PlaylistForm from "./playlist-form";
import ScriptNameForm from "./script-name-form";
import ShowOpponentsForm from "./show-opponents-form";

interface GameFormProps {
  showOpponents: number;
  scriptName: string;
  modeScriptInfo: ModeScriptInfo;
  modeScriptSettings: Record<string, unknown>;
}

export default function GameForm({
  showOpponents,
  scriptName,
  modeScriptInfo,
  modeScriptSettings,
}: GameFormProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-6 flex-col min-[960px]:flex-row">
        <div className="flex flex-col gap-4 flex-1">
          <ShowOpponentsForm showOpponents={showOpponents} />
          <ScriptNameForm scriptName={scriptName} />
        </div>
        <div className="flex flex-col gap-4 flex-1">
          <MatchSettingsForm />
          <PlaylistForm />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col">
            <h2 className="text-lg font-bold">Mode Script Settings </h2>
            <p className="text-base text-muted-foreground font-medium overflow-hidden overflow-ellipsis text-nowrap">
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
          modeScriptSettings={modeScriptSettings}
          modeScriptInfo={modeScriptInfo}
        />
      </div>
    </div>
  );
}
