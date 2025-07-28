import z from "zod";
import { DatabaseSchema } from "./database-schema";
import { ServerSchema } from "./server-schema";
import { ServerControllerSchema } from "./server-controller-schema";

export const ServerSetupSchema = z.object({
  server: ServerSchema,
  serverController: ServerControllerSchema.optional(),
  database: DatabaseSchema.optional(),
});

export type ServerSetupSchemaType = z.infer<typeof ServerSetupSchema>;
