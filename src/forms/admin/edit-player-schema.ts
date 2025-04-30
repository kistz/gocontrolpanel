import { z } from "zod";

export const EditPlayerSchema = z.object({
  roles: z.array(z.string()),
});
