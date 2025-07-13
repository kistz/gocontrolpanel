import { z } from "zod";

const UserWithRoleSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  role: z.string().min(1, "Role is required"),
});

export const EditGroupSchema = z.object({
  name: z.string().min(1, "Group name is required"),
  description: z.string().optional(),
  groupServers: z.array(z.string()).optional(),
  groupMembers: z
    .array(UserWithRoleSchema)
    .optional()
    .describe("List of users in the group with their roles"),
});

export type EditGroupSchemaType = z.infer<typeof EditGroupSchema>;
