import { auth, hasPermission } from "@/lib/auth";
import { routePermissions } from "@/routes";
import { Icon } from "@tabler/icons-react";
import NavAdmin from "./nav-admin";
import NavFooter from "./nav-footer";
import NavGroups from "./nav-groups";

export interface NavItem {
  id?: number;
  name: string;
  url?: string;
  icon: Icon;
  items?: NavItem[];
  isActive?: boolean;
  auth?: boolean;
}

export interface NavGroup {
  name?: string;
  items: NavItem[];
}

export default async function Navbar() {
  const session = await auth();

  const canViewGroups = await hasPermission(routePermissions.admin.groups.view);

  const canViewAdmin = canViewGroups;

  return (
    <>
      {session && <NavGroups />}
      {session && canViewAdmin && <NavAdmin canViewAdmin={canViewAdmin} />}
      <NavFooter />
    </>
  );
}
