import { z } from "zod";

export const DefaultAttributesSchema = z
  .object({
    pos: z
      .object({
        x: z.number(),
        y: z.number(),
      })
      .partial(),
    zIndex: z.number(),
    scale: z.number(),
    rot: z.number(),
    hidden: z.boolean(),
    id: z.string(),
    class: z.string(),
  })
  .partial();

export type DefaultAttributesSchemaType = z.infer<
  typeof DefaultAttributesSchema
>;
