import { auth } from "@/lib/auth";
import { routes } from "@/routes";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect(routes.login);
  }

  if (!session.user.roles.includes("admin")) {
    redirect(routes.dashboard);
  }

  return children;
}
