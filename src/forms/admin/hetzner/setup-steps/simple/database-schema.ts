import z from "zod";
import { AddHetznerDatabaseSchema } from "../../database/add-hetzner-database-schema";

export const DatabaseSchema = AddHetznerDatabaseSchema.omit({
  image: true,
  location: true,
  databaseType: true,
  databaseRootPassword: true,
  databaseUser: true,
  databasePassword: true,
})
  .extend({
    new: z.boolean().optional(),
    existing: z.string().optional(),
    local: z.boolean().optional(),
    databaseIp: z.string().optional(),
    databaseType: z.string().optional(),
    databaseRootPassword: z.string().optional(),
    databaseUser: z.string().optional(),
    databasePassword: z.string().optional(),
  })
  .refine(
    (data) => {
      return data.new || (data.existing && data.existing.trim() !== "");
    },
    {
      message: "Existing database is required unless creating a new one.",
      path: ["existing"],
    },
  );
