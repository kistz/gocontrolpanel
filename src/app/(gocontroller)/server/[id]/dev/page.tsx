import DevDashboard from "@/components/dev/dashboard";
import { routes } from "@/routes";
import { redirect } from "next/navigation";

export default async function LivePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  redirect(routes.dashboard);

  return <DevDashboard serverId={id} />;
}
