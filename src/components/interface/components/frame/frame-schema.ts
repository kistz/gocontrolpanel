import { z } from "zod";
import { DefaultAttributesSchema } from "../default-attributes-schema";

export const FrameSchema = DefaultAttributesSchema;

export type FrameSchemaType = z.infer<typeof FrameSchema>;