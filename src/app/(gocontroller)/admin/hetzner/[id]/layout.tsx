import { withAuth } from "@/lib/auth";
import { getHetznerProject } from "@/lib/hetzner";
import { routes } from "@/routes";
import { redirect } from "next/navigation";

export default async function AdminHetznerProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const session = await withAuth(["admin"]);
  const { id } = await params;

  if (!session) {
    redirect(routes.login);
  }

  const data = await getHetznerProject(id);
  if (!data) {
    redirect(routes.admin.hetzner);
  }

  if (
    !data.hetznerProjectUsers.some(
      (user) => user.userId === session.user.id && user.role === "Admin",
    )
  ) {
    redirect(routes.admin.hetzner);
  }

  return children;
}
