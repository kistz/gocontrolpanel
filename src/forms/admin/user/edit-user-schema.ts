import { z } from "zod";

export const EditUserSchema = z.object({
  admin: z.boolean(),
  permissions: z.array(z.string()).optional(),
});

export type EditUserSchemaType = z.infer<typeof EditUserSchema>;
