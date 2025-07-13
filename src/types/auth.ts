import { GroupRole, Servers } from "@/lib/prisma/generated";

export interface UserGroup {
  id: string;
  name: string;
  role: GroupRole;
  servers: Omit<Servers, "user" | "password" | "createdAt" | "updatedAt" | "deletedAt">[];
}
