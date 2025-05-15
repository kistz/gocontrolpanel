export default async function LivePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Live</h1>
      <p className="text-sm text-gray-500">
        This page is for live server management. You can view the server status
        and manage players in real-time.
      </p>
    </div>
  );
}
