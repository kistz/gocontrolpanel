import { ipInCidr } from "@/lib/utils";
import { z } from "zod";
import { AddHetznerNetworkSchema } from "../network/add-hetzner-network-schema";

export const NetworkSchema = AddHetznerNetworkSchema.extend({
  mode: z.enum(["existing", "new"]),
  serverIp: z.string(),
  databaseIp: z.string(),
}).superRefine((data, ctx) => {
  const { ipRange, serverIp, databaseIp } = data;

  if (!ipInCidr(serverIp, ipRange)) {
    ctx.addIssue({
      path: ["serverIp"],
      code: z.ZodIssueCode.custom,
      message: "Server IP must be within the network IP range.",
    });
  }

  if (!ipInCidr(databaseIp, ipRange)) {
    ctx.addIssue({
      path: ["databaseIp"],
      code: z.ZodIssueCode.custom,
      message: "Database IP must be within the network IP range.",
    });
  }
});