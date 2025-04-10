import { z } from "zod";

export const ShowOpponentsSchema = z.object({
  showOpponents: z.coerce.number().min(0, "Show Opponents must be atleast 0"),
});

export const ScriptNameSchema = z.object({
  scriptName: z.string().min(1, "Script Name is required"),
});

export const MatchSettingsSchema = z.object({
  filename: z.string().min(1, "Filename is required"),
});

export const PlaylistSchema = z.object({
  filename: z.string().min(1, "Filename is required"),
});

export const ModeScriptSettingsSchema = z.record(z.unknown());
