import { auth } from "@/lib/auth";
import { Icon } from "@tabler/icons-react";
import NavAdmin from "./nav-admin";
import NavFooter from "./nav-footer";
import NavServers from "./nav-servers";

export interface NavItem {
  id?: number;
  name: string;
  url?: string;
  icon: Icon;
  items?: NavItem[];
  isActive?: boolean;
  healthStatus?: string;
}

export interface NavGroup {
  name?: string;
  items: NavItem[];
}

export default async function Navbar() {
  const session = await auth();

  return (
    <>
      {session &&
        session.user.admin && (
          <NavServers />
        )}
      {session && session.user.admin && <NavAdmin />}
      <NavFooter />
    </>
  );
}
