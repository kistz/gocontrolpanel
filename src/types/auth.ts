import { GroupRole } from "@/lib/prisma/generated";

export interface UserGroup {
  id: string;
  name: string;
  role: GroupRole;
  serverUuids: string[];
}