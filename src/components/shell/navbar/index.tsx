import { auth } from "@/lib/auth";
import { Icon } from "@tabler/icons-react";
import NavAdmin from "./nav-admin";
import NavMain from "./nav-main";
import NavServers from "./nav-servers";

export interface NavItem {
  id?: number;
  name: string;
  url?: string;
  icon: Icon;
  items?: NavItem[];
  isActive?: boolean;
}

export interface NavGroup {
  name?: string;
  items: NavItem[];
}

export default async function Navbar() {
  const session = await auth();

  return (
    <>
      <NavMain />
      {session &&
        (session.user.roles.includes("admin") ||
          session.user.roles.includes("moderator")) && <NavServers />}
      {session && session.user.roles.includes("admin") && <NavAdmin />}
    </>
  );
}
