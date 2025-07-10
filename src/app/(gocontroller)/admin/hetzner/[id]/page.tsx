import { getHetznerServers } from "@/actions/hetzner/servers";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: servers } = await getHetznerServers(id);
  console.log(servers)

  return id;
}
