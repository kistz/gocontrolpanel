import DevDashboard from "@/components/dev/dashboard";

export default async function LivePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <DevDashboard serverId={id} />;
}
