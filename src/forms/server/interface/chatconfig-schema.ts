import { z } from "zod";

export const ChatConfigSchema = z.object({
  manualRouting: z.boolean(),
  messageFormat: z.string().optional(),
});

export type ChatConfigSchemaType = z.infer<typeof ChatConfigSchema>;
