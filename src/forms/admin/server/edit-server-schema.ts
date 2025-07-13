import { z } from "zod";

export const EditServerSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().optional(),
  host: z.string().min(1, { message: "Host is required" }),
  port: z.coerce
    .number()
    .min(1, { message: "Port must be greater than 0" }),
  user: z.string().min(1, { message: "User is required" }),
  password: z.string().min(1, { message: "Password is required" }),
  filemanagerUrl: z.string().optional(),
});

export type EditServerSchemaType = z.infer<typeof EditServerSchema>;
