import { ServerSettingsSchema } from "@/forms/server/settings-schema";
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