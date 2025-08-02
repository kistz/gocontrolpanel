import z from "zod";
import { AddHetznerServerSchema } from "../../server/add-hetzner-server-schema";

export const ServerSchema = AddHetznerServerSchema.omit({
  image: true,
  superAdminPassword: true,
  adminPassword: true,
  userPassword: true,
  filemanagerPassword: true,
}).extend({
  controller: z.boolean().optional(),
});
