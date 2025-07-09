import { z } from "zod";

export const EditUserSchema = z.object({
  admin: z.boolean(),
});

export type EditUserSchemaType = z.infer<typeof EditUserSchema>;
