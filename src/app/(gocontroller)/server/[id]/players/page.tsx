export default async function ServerPlayersPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Server Players</h1>
        <h4 className="text-muted-foreground">Manage server players.</h4>
      </div>
    </div>
  );
}
