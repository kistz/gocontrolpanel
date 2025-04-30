import { auth, withAuth } from "@/lib/auth";
import { routes } from "@/routes";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await withAuth(["admin"]);

  if (!session) {
    redirect(routes.login);
  }

  return children;
}
