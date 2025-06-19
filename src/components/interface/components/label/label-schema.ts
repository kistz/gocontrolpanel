import { z } from "zod";
import { DefaultAttributesSchema } from "../default-attributes-schema";
import { FONTS, H_ALIGN, V_ALIGN } from "@/lib/manialink/attributes";

export const LabelSchema = DefaultAttributesSchema.extend({
  size: z.object({
    width: z.number(),
    height: z.number(),
  }).partial(),
  hAlign: z.enum([...H_ALIGN] as [string, ...string[]]),
  vAlign: z.enum([...V_ALIGN] as [string, ...string[]]),
  scriptEvents: z.boolean(),
  opacity: z.boolean(),
  action: z.string(),
  url: z.string(),
  manialink: z.string(),
  scriptAction: z.string(),
  style: z.string(),
  textFont: z.enum([...FONTS] as [string, ...string[]]),
  textSize: z.number(),
  textColor: z.string(),
  focusAreaColor1: z.string(),
  focusAreaColor2: z.string(),
  text: z.string(),
  textPrefix: z.string(),
  textEmboss: z.boolean(),
  autoNewLine: z.boolean(),
  lineSpacing: z.number(),
  maxLine: z.number(),
  translate: z.boolean(),
  textId: z.string(),
  appendEllipsis: z.boolean(),
  italicSlope: z.number(),
}).partial();

export type LabelSchemaType = z.infer<typeof LabelSchema>;
  