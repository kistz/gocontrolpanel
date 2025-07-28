import { z } from "zod";
import { hetznerServerNameSchema } from "../server/add-hetzner-server-schema";

export const AddHetznerDatabaseSchema = z.object({
  name: hetznerServerNameSchema,
  serverType: z.string().min(1, { message: "Server type is required" }),
});

export type AddHetznerDatabaseSchemaType = z.infer<
  typeof AddHetznerDatabaseSchema
>;
