import { withAuth } from "@/lib/auth";
import { routes } from "@/routes";
import { redirect } from "next/navigation";

export default async function ServerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await withAuth(["admin", "moderator"]);

  if (!session) {
    redirect(routes.login);
  }

  return children;
}
