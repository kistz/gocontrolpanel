import { auth } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await auth();

  const allowedids = [
    ...new Set(session?.user.groups.map((group) => group.ids).flat() || []),
  ];
  if (allowedids.length === 0) {
    return new Response("No servers available", { status: 403 });
  }

  let selectedids = allowedids;
  const searchParams = new URL(req.url).searchParams;
  const serverParam = searchParams.get("servers");
  if (serverParam) {
    selectedids = serverParam
      .split(",")
      .filter((uuid) => allowedids.includes(uuid));
  }

  if (selectedids.length === 0) {
    return new Response("No valid servers selected", { status: 400 });
  }

  // const stream = createSSEStream((push) => {
  //   push("connected", { timestamp: new Date().toISOString() })

  //   getGbxClient(uuid).then((gbx) => {
  //     const onConnect = (data: any) => push("connect", data)
  //     const onDisconnect = (data: any) => push("disconnect", data)

  //     gbx.on("ManiaPlanet.PlayerConnect", onConnect)
  //     gbx.on("ManiaPlanet.PlayerDisconnect", onDisconnect)

  //     // Return cleanup function
  //     return () => {
  //       gbx.off("ManiaPlanet.PlayerConnect", onConnect)
  //       gbx.off("ManiaPlanet.PlayerDisconnect", onDisconnect)
  //     }
  //   })
  // })

  // return new Response(stream, {
  //   headers: {
  //     "Content-Type": "text/event-stream",
  //     "Cache-Control": "no-cache",
  //     "Connection": "keep-alive",
  //   },
  // })
}
