import { z } from "zod";
import { DefaultAttributesSchema } from "../default-attributes-schema";

export const QuadSchema = DefaultAttributesSchema.extend({
  size: z.object({
    width: z.number(),
    height: z.number(),
  }).partial(),
  hAlign: z.enum(["left", "center", "right"]),
  vAlign: z.enum(["top", "center", "center2", "bottom"]),
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
  blend: z.enum(["default", "add"]),
  style: z.string(),
  subStyle: z.string(),
  styleSelected: z.boolean(),
  colorize: z.string(),
  modulateColor: z.string(),
  autoScale: z.boolean(),
  keepRatio: z.enum(["Inactive", "Fit", "Clip"]),
  autoScaleFixedWidth: z.boolean(),
  pinCorners: z.string(),
}).partial();

export type QuadSchemaType = z.infer<typeof QuadSchema>;