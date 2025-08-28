import z from "zod";

export const PluginsSchema = z.object({
  admin: z.object({
    enabled: z.boolean().optional(),
    config: z.object({}).optional(),
  }),
  ecm: z.object({
    enabled: z.boolean().optional(),
    config: z.object({
      apiKey: z
        .string()
        .optional()
        .refine(
          (val) => !val || (val.match(/_/g)?.length ?? 0) <= 1,
          "apiKey may contain at most one underscore",
        ),
    }),
  }),
});

export type PluginsSchemaType = z.infer<typeof PluginsSchema>;
