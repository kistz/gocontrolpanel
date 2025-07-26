import z from "zod";
import { AddHetznerDatabaseSchema } from "../database/add-hetzner-database-schema";

export const DatabaseSchema = AddHetznerDatabaseSchema.extend({
  mode: z.enum(["existing", "new"]),
});