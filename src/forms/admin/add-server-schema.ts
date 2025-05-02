import { z } from "zod";

export const AddServerSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().optional(),
  host: z.string().min(1, { message: "Host is required" }),
  xmlrpcPort: z.number().min(1, { message: "XMLRPC Port is required" }),
  user: z.string().min(1, { message: "User is required" }),
  pass: z.string().min(1, { message: "Password is required" }),
});
