import { auth } from "@/lib/auth"
import { getGbxClient } from "@/lib/gbxclient"
import { createSSEStream } from "@/lib/sse"

export async function GET(req: Request) {
  const session = await auth()

  const allowedServerUuids = [... new Set(session?.user.groups.map((group) => group.serverUuids).flat() || [])];
  if (allowedServerUuids.length === 0) {
    return new Response("No servers available", { status: 403 })
  }

  let selectedServerUuids = allowedServerUuids;
  const searchParams = new URL(req.url).searchParams;
  const serverParam = searchParams.get("servers");
  if (serverParam) {
    selectedServerUuids = serverParam.split(",").filter(uuid => allowedServerUuids.includes(uuid));
  }

  if (selectedServerUuids.length === 0) {
    return new Response("No valid servers selected", { status: 400 })
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