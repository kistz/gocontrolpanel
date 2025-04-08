import { z } from "zod";

export const ServerSettingsSchema = z.object({
  defaultOptions: z.object({
    serverName: z.string().min(1, "Server name is required"),
    serverComment: z.string().optional(),
    serverPassword: z.string().optional(),
    serverPasswordSpectator: z.string().optional(),
    callVoteTimeout: z.coerce.number().int().min(0, "Vote Timeout must be atleast 0").max(255, "Vote Timeout must be less than or equal 255"),
    callVoteRatio: z.coerce.number().min(0, "Vote Ratio must be atleast 0").max(1, "Vote Ratio must be less than or equal 1"),
    serverVisibility: z.enum(["visible", "hidden", "hidden from nations"]),
    maxPlayers: z.coerce.number().int().min(1, "Max Players must be atleast 1").max(255, "Max Players must be less than or equal to 255").optional(),
    maxSpectators: z.coerce.number().int().min(1, "Max Spectators must be atleast 1").max(255, "Max Spectators must be less than or equal to 255").optional(),
    keepPlayerSlots: z.boolean(),
    allowMapDownload: z.boolean(),
    autoSaveReplays: z.boolean(),
    horns: z.boolean(),
    serviceAnnouncements: z.boolean(),
  }),

  downloadRate: z.coerce.number().int().min(1, "Download Rate is required"),
  uploadRate: z.coerce.number().int().min(1, "Upload Rate is required"),
  profileSkins: z.boolean(),
});
