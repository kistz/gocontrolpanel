import { getHetznerProject } from "@/actions/database/hetzner-projects";
import { withAuth } from "@/lib/auth";
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

  const { data } = await getHetznerProject(id);
  if (!data) {
    redirect(routes.admin.hetzner);
  }

  if (!session.user.admin && !data.hetznerProjectUsers.some((hpu) => hpu.userId === session.user.id)) {
    redirect(routes.admin.hetzner);
  }

  return children;
}
