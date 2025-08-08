import z from "zod";
import { AddHetznerDatabaseSchema } from "../../database/add-hetzner-database-schema";

export const DatabaseSchema = AddHetznerDatabaseSchema.extend({
  new: z.boolean().optional(),
  existing: z.string().optional(),
  local: z.boolean().optional(),
}).refine(
  (data) => {
    return data.new || (data.existing && data.existing.trim() !== "");
  },
  {
    message: "Existing database is required unless creating a new one.",
    path: ["existing"],
  },
);
