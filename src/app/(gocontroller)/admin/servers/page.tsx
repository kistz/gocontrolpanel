import { getServers } from "@/lib/gbxclient";

export default async function AdminServersPage() {
  const servers = await getServers();
  console.log(servers);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Servers</h1>
      <p>Manage servers here.</p>
    </div>
  );
}
