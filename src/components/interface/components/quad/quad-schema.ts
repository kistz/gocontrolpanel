import {
  BLENDS,
  H_ALIGN,
  KEEP_RATIO,
  V_ALIGN,
} from "@/lib/manialink/attributes";
import { z } from "zod";
import { DefaultAttributesSchema } from "../default-attributes-schema";

export const QuadSchema = DefaultAttributesSchema.extend({
  size: z
    .object({
      width: z.number(),
      height: z.number(),
    })
    .partial(),
  hAlign: z.enum([...H_ALIGN] as [string, ...string[]]),
  vAlign: z.enum([...V_ALIGN] as [string, ...string[]]),
  opacity: z.boolean(),
  scriptEvents: z.boolean(),
  action: z.string(),
  url: z.string(),
  manialink: z.string(),
  scriptAction: z.string(),
  image: z.string(),
  imageFocus: z.string(),
  alphaMask: z.string(),
  bgColor: z.string(),
  bgColorFocus: z.string(),
  blurAmount: z.number(),
  blend: z.enum([...BLENDS] as [string, ...string[]]),
  style: z.string(),
  subStyle: z.string(),
  styleSelected: z.boolean(),
  colorize: z.string(),
  modulateColor: z.string(),
  autoScale: z.boolean(),
  keepRatio: z.enum([...KEEP_RATIO] as [string, ...string[]]),
  autoScaleFixedWidth: z.boolean(),
  pinCorners: z.string(),
}).partial();

export type QuadSchemaType = z.infer<typeof QuadSchema>;
