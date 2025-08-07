export default async function ServerTMXPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-2xl font-bold mb-4">TMX Maps for Server {id}</h1>
      <p className="text-gray-600">This page will display TMX maps for server {id}.</p>
      {/* Additional content can be added here */}
    </div>
  );
}