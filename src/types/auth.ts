import { GroupRole, HetznerProjectRole, Servers } from "@/lib/prisma/generated";

export interface UserGroup {
  id: string;
  name: string;
  role: GroupRole;
  servers: Omit<Servers, "user" | "password" | "manualRouting" | "messageFormat" | "connectMessage" | "disconnectMessage" | "createdAt" | "updatedAt" | "deletedAt">[];
}

export interface UserProject {
  id: string;
  name: string;
  role: HetznerProjectRole;
}