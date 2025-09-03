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

  const canViewUsers = await hasPermission(routePermissions.admin.users.view);
  const canViewGroups = await hasPermission(routePermissions.admin.groups.view);
  const canViewServers = await hasPermission(
    routePermissions.admin.servers.view,
  );
  const canViewRoles = await hasPermission(routePermissions.admin.roles.view);
  const canViewHetzner = await hasPermission(
    routePermissions.admin.hetzner.view,
  );

  const canViewAdmin =
    canViewUsers ||
    canViewGroups ||
    canViewServers ||
    canViewRoles ||
    canViewHetzner;

  return (
    <>
      {session && <NavGroups />}
      {session && canViewAdmin && (
        <NavAdmin
          canViewUsers={canViewUsers}
          canViewGroups={canViewGroups}
          canViewServers={canViewServers}
          canViewRoles={canViewRoles}
          canViewHetzner={canViewHetzner}
        />
      )}
      <NavFooter />
    </>
  );
}
