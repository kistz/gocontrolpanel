export default async function ServerNadeoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <div>Server Nadeo Page for server {id}</div>;
}
