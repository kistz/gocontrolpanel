"use server";

import { doServerActionWithAuth } from "@/lib/actions";
import { getGbxClient } from "@/lib/gbxclient";
import { Interfaces } from "@/lib/prisma/generated";
import { environment } from "@/lib/twig";
import { ServerError, ServerResponse } from "@/types/responses";
import path from "path";
import { renderQuadComponent } from "./components/quad";

const records = [
  { position: 1, player: "Marijntje04", time: 12345 },
  { position: 2, player: "Cheeselover2298", time: 12345 },
  { position: 3, player: "Marijntje04", time: 12345 },
  { position: 4, player: "Marijntje04", time: 12345 },
  { position: 5, player: "Marijntje04", time: 12345 },
  { position: 6, player: "Marijntje04", time: 12345 },
  { position: 7, player: "Marijntje04", time: 12345 },
  { position: 8, player: "Marijntje04", time: 12345 },
  { position: 9, player: "Marijntje04", time: 12345 },
  { position: 10, player: "Marijntje04", time: 12345 },
];

export async function renderInterface(
  interfaceData: Interfaces,
): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    // Hide any existing Manialink pages before rendering the new interface
    const client = await getGbxClient(interfaceData.serverUuid);
    await client.call("SendHideManialinkPage");

    if (!interfaceData.interfaceString) {
      return;
    }

    const data = JSON.parse(interfaceData.interfaceString);

    const manialinks: string[] = [];

    for (const widgetData of data) {
      switch (widgetData.componentId) {
        case "quad-component":
          manialinks.push(await renderQuadComponent(widgetData.attributes));
          break;
        default:
          console.warn(`Unknown widget id: ${widgetData.componentId}`);
      }
    }

    const template = environment.loadTemplate(
      `${path.resolve(process.cwd(), "src/lib/manialink/manialink.xml.twig")}`,
      "utf-8",
    );

    const manialink = template.render(
      environment,
      new Map(
        Object.entries({
          id: interfaceData.id,
          manialinks,
        }),
      ),
    );

    await client.call("SendDisplayManialinkPage", manialink, 0, false);
  });
}
