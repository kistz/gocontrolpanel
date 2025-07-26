import z from "zod";
import { DatabaseSchema } from "./database-schema";
import { NetworkSchema } from "./network-schema";
import { ServerControllerSchema } from "./server-controller-schema";
import { ServerSchema } from "./server-schema";

// step 1: server only
export const ServerStepSchema = z.object({
  server: ServerSchema,
});

// step 2: controller
export const ControllerStepSchema = z.object({
  serverController: ServerControllerSchema,
});

// step 3: database
export const DatabaseStepSchema = z.object({
  database: DatabaseSchema,
});

// step 4: network
export const NetworkStepSchema = z.object({
  network: NetworkSchema,
});


export const ServerSetupSchema = z
  .object({
    server: ServerSchema,
    serverController: ServerControllerSchema.optional(),
    database: DatabaseSchema.optional(),
    network: NetworkSchema.optional(),
  })
  .refine(
    (data) => {
      if (data.server.controller) {
        return data.database !== undefined && data.network !== undefined;
      }
      return true;
    },
    {
      message:
        "Database and network are required when a server controller is provided.",
      path: ["database"],
    },
  );

export type ServerSetupSchemaType = z.infer<typeof ServerSetupSchema>;
export type ServerStepSchemaType = z.infer<typeof ServerStepSchema>;
export type ControllerStepSchemaType = z.infer<typeof ControllerStepSchema>;
export type DatabaseStepSchemaType = z.infer<typeof DatabaseStepSchema>;
export type NetworkStepSchemaType = z.infer<typeof NetworkStepSchema>;
