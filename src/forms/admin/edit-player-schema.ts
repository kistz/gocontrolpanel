import { z } from "zod";

export const EditPlayerSchema = z.object({
  roles: z.array(z.string()),
});

export type EditPlayerSchemaType = z.infer<typeof EditPlayerSchema>;
