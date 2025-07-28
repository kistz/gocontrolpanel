import z from "zod";
import { DatabaseSchema } from "./database-schema";
import { ServerSchema } from "./server-schema";
import { ServerControllerSchema } from "./server-controller-schema";

export const SimpleServerSetupSchema = z.object({
  server: ServerSchema,
  serverController: ServerControllerSchema.optional(),
  database: DatabaseSchema.optional(),
});

export type SimpleServerSetupSchemaType = z.infer<typeof SimpleServerSetupSchema>;
