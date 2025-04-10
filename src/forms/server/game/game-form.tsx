import { ModeScriptInfo } from "@/types/server";
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
    <div className="flex">
      <div className="flex flex-col gap-4 flex-1">
        <ShowOpponentsForm showOpponents={showOpponents} />
        <ScriptNameForm scriptName={scriptName} />
      </div>

      <div className="flex flex-col gap-1 flex-1"></div>
    </div>
  );
}
