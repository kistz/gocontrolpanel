import { ServerSettingsSchema } from "@/forms/server/settings-schema";
import { z } from "zod";

export type ServerSettings = z.infer<typeof ServerSettingsSchema>;
