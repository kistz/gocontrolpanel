import z from "zod";

export const PluginsSchema = z.object({
  admin: z.boolean().optional(),
});

export type PluginsSchemaType = z.infer<typeof PluginsSchema>;
