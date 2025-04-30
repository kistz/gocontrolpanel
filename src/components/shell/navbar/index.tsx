import { withAuth } from "@/lib/auth";
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
  const session = await withAuth(["moderator", "admin"]);

  return (
    <>
      <NavMain />
      {session && <NavServers />}
      {session && session.user.roles.includes("admin") && <NavAdmin />}
    </>
  );
}
