import { z } from "zod";
import { hetznerServerNameSchema } from "../server/add-hetzner-server-schema";

export const AddHetznerDatabaseSchema = z.object({
  name: hetznerServerNameSchema,
  serverType: z.string().min(1, { message: "Server type is required" }),
  databaseName: z.string().min(1, { message: "Database name is required" }),
  image: z.string().min(1, { message: "Image is required" }),
  location: z.string().min(1, { message: "Location is required" }),
  databaseType: z.string().min(1, { message: "Database type is required" }),
  databaseRootPassword: z.string().optional(),
  databaseUser: z.string().optional(),
  databasePassword: z.string().optional(),
  networkId: z.number().optional(),
});

export type AddHetznerDatabaseSchemaType = z.infer<
  typeof AddHetznerDatabaseSchema
>;
