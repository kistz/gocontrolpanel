import LiveDashboard from "@/components/live/live-dashboard";

export default async function LivePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <LiveDashboard serverId={id} />;
}
