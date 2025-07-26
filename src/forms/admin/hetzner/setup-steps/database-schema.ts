import z from "zod";
import { AddHetznerDatabaseSchema } from "../database/add-hetzner-database-schema";

export const DatabaseSchema = AddHetznerDatabaseSchema.extend({
  new: z.boolean().optional(),
  existing: z.string().optional(),
});
