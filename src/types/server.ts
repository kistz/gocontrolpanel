import {
  MatchSettingsSchema,
  ModeScriptSettingsSchema,
  PlaylistSchema,
  ScriptNameSchema,
  ShowOpponentsSchema,
} from "@/forms/server/game/game-schema";
import { ServerSettingsSchema } from "@/forms/server/settings/settings-schema";
import { z } from "zod";

export type ServerSettings = z.infer<typeof ServerSettingsSchema>;

export interface ModeScriptInfo {
  Name: string;
  CompatibleMapTypes: string;
  Description: string;
  Version: string;
  ParamDescs: ScriptParamDescs[];
  CommandDescs: ScriptCommandDescs[];
}

export interface ScriptParamDescs {
  Name: string;
  Desc: string;
  Type: string;
  Default: string;
}

export interface ScriptCommandDescs {
  Name: string;
  Desc: string;
  Type: string;
  Default: string;
}

export type ShowOpponents = z.infer<typeof ShowOpponentsSchema>;

export type ScriptName = z.infer<typeof ScriptNameSchema>;

export type MatchSettings = z.infer<typeof MatchSettingsSchema>;

export type Playlist = z.infer<typeof PlaylistSchema>;

export type ModeScriptSettings = z.infer<typeof ModeScriptSettingsSchema>;
