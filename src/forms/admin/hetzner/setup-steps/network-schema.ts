import { inRange } from "range_check";
import { z } from "zod";
import { AddHetznerNetworkSchema } from "../network/add-hetzner-network-schema";

export const NetworkSchema = AddHetznerNetworkSchema.extend({
  new: z.boolean().optional(),
  existing: z.string().optional(),
  serverIp: z.string(),
  databaseIp: z.string(),
}).superRefine((data, ctx) => {
  const { ipRange, serverIp, databaseIp } = data;

  if (serverIp === databaseIp) {
    ctx.addIssue({
      path: ["serverIp"],
      code: z.ZodIssueCode.custom,
      message: "Server IP and Database IP cannot be the same.",
    });
  }

  if (!inRange(serverIp, ipRange)) {
    ctx.addIssue({
      path: ["serverIp"],
      code: z.ZodIssueCode.custom,
      message: "Server IP must be within the network IP range.",
    });
  }

  if (!inRange(databaseIp, ipRange)) {
    ctx.addIssue({
      path: ["databaseIp"],
      code: z.ZodIssueCode.custom,
      message: "Database IP must be within the network IP range.",
    });
  }
});
