import LiveDashboard from "@/components/live/live-dashboard";

export default async function LivePage({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;

  return <LiveDashboard serverUuid={uuid} />;
}
