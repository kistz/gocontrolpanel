import { Icon } from "@tabler/icons-react";
import NavMain from "./nav-main";
import NavServers from "./nav-servers";
import { auth, withAuth } from "@/lib/auth";

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
      {session && (<NavServers />)}
    </>
  );
}
