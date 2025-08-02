import z from "zod";

export const CommandsSchema = z.object({
  admin: z.boolean().optional(),
});

export type CommandsSchemaType = z.infer<typeof CommandsSchema>;
