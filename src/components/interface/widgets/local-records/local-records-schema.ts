import { z } from "zod";

export const LocalRecordsSchema = z.object({
  header: z.object({
    text: z.string().optional(),
    font: z.string().optional(),
  }).optional(),
  record: z.object({
    padding: z.object({
      left: z.number().optional(),
      right: z.number().optional(),
      top: z.number().optional(),
      bottom: z.number().optional(),
    }).optional(),
    border: z.object({
      color: z.string().optional(),
      bottom: z.number().optional(),
      top: z.number().optional(),
      left: z.number().optional(),
      right: z.number().optional(),
    }).optional(),
    position: z.object({
      width: z.number().optional(),
      font: z.string().optional(),
      color: z.string().optional(),
    }).optional(),
    player: z.object({
      font: z.string().optional(),
      color: z.string().optional(),
      padding: z.object({
        left: z.number().optional(),
        right: z.number().optional(),
        top: z.number().optional(),
        bottom: z.number().optional(),
      }).optional(),
    }).optional(),
    time: z.object({
      font: z.string().optional(),
      color: z.string().optional(),
      padding: z.object({
        left: z.number().optional(),
        right: z.number().optional(),
        top: z.number().optional(),
        bottom: z.number().optional(),
      }).optional(),
    }).optional(),
  }).optional(),
});

export type LocalRecordsSchemaType = z.infer<typeof LocalRecordsSchema>;
