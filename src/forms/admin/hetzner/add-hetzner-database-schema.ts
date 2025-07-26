import { z } from "zod";
import { hetznerServerNameSchema } from "./add-hetzner-server-schema";

export const AddHetznerDatabaseSchema = z.object({
  name: hetznerServerNameSchema,
  serverType: z.string().min(1, { message: "Server type is required" }),
  image: z.string().min(1, { message: "Image is required" }),
  location: z.string().min(1, { message: "Location is required" }),
  databaseRootPassword: z.string().optional(),
  databaseName: z.string().min(1, { message: "Database name is required" }),
  databaseUser: z.string().optional(),
  databasePassword: z.string().optional(),
});

export type AddHetznerDatabaseSchemaType = z.infer<
  typeof AddHetznerDatabaseSchema
>;
