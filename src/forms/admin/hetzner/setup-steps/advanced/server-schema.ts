import z from "zod";
import { AddHetznerServerSchema } from "../../server/add-hetzner-server-schema";

export const ServerSchema = AddHetznerServerSchema.extend({
  controller: z.boolean().optional(),
  image: z.string().min(1, { message: "Image is required" }),
  superAdminPassword: z.string().optional(),
  adminPassword: z.string().optional(),
  userPassword: z.string().optional(),
  filemanagerPassword: z.string().optional(),
});
