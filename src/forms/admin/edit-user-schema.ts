import { z } from "zod";

export const EditUserSchema = z.object({
  roles: z.array(z.string()),
});

export type EditUserSchemaType = z.infer<typeof EditUserSchema>;
