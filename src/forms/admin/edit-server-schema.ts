import { z } from "zod";

export const EditServerSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().optional(),
  host: z.string().min(1, { message: "Host is required" }),
  xmlrpcPort: z.coerce
    .number()
    .min(1, { message: "Port must be greater than 0" }),
  user: z.string().min(1, { message: "User is required" }),
  pass: z.string().min(1, { message: "Password is required" }),
  fmHost: z.string().optional(),
  fmPort: z.coerce
    .number()
    .min(1, { message: "Port must be greater than 0" })
    .optional(),
});

export type EditServerSchemaType = z.infer<typeof EditServerSchema>;
