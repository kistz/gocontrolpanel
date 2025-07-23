import { z } from "zod";

export const AddGroupSchema = z.object({
  name: z.string().min(1, { message: "Group name is required" }),
  description: z.string().optional(),
  public: z.boolean(),
  groupServers: z.array(z.string()).optional(),
  groupMembers: z
    .array(
      z.object({
        userId: z.string().min(1, "User is required"),
        role: z.string().min(1, "Role is required"),
      }),
    )
    .optional()
    .describe("List of users in the group with their roles"),
});

export type AddGroupSchemaType = z.infer<typeof AddGroupSchema>;
