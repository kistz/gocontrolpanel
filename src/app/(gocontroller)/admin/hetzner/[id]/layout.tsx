import { getHetznerProject } from "@/actions/database/hetzner-projects";
import { auth } from "@/lib/auth";
import { routes } from "@/routes";
import { redirect } from "next/navigation";

export default async function AdminHetznerProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const { id } = await params;

  if (!session) {
    redirect(routes.login);
  }

  const { data } = await getHetznerProject(id);
  if (!data) {
    redirect(routes.admin.hetzner);
  }

  if (!data.users.some((user) => user.userId === session.user.id)) {
    redirect(routes.admin.hetzner);
  }

  return children;
}
