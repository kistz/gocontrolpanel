import { auth, hasPermission } from "@/lib/auth";
import { routePermissions, routes } from "@/routes";
import { redirect } from "next/navigation";

export default async function ClubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) {
    redirect(routes.login);
  }

  const canView = await hasPermission(routePermissions.clubs.view);

  if (!canView) {
    redirect(routes.dashboard);
  }

  return children;
}
