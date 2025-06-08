import DevDashboard from "@/components/dev/dashboard";

export default async function LivePage({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;

  return <DevDashboard serverUuid={uuid} />;
}
