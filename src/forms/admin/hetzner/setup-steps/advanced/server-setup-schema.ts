import z from "zod";
import { DatabaseSchema } from "./database-schema";
import { NetworkSchema } from "./network-schema";
import { ServerControllerSchema } from "./server-controller-schema";
import { ServerSchema } from "./server-schema";

export const ServerSetupSchema = z.object({
  server: ServerSchema,
  serverController: ServerControllerSchema.optional(),
  database: DatabaseSchema.optional(),
  network: NetworkSchema.optional(),
});

export type ServerSetupSchemaType = z.infer<typeof ServerSetupSchema>;
