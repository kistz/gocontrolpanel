import { inRange } from "range_check";
import { z } from "zod";
import { AddHetznerNetworkSchema } from "../../network/add-hetzner-network-schema";

export const NetworkSchema = AddHetznerNetworkSchema.extend({
  new: z.boolean().optional(),
  existing: z.string().optional(),
  databaseIp: z.string(),
  databaseInNetwork: z.boolean().optional(),
}).superRefine((data, ctx) => {
  const { ipRange, databaseIp, new: isNew, existing } = data;

  if (!isNew && (!existing || existing.trim() === "")) {
    ctx.addIssue({
      path: ["existing"],
      code: z.ZodIssueCode.custom,
      message: "Existing network must be selected unless creating a new one.",
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
