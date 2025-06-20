"use server";

import { doServerActionWithAuth } from "@/lib/actions";
import { getGbxClient } from "@/lib/gbxclient";
import { Interfaces } from "@/lib/prisma/generated";
import { environment } from "@/lib/twig";
import { ServerResponse } from "@/types/responses";
import path from "path";
import { renderLabelComponent } from "./components/label";
import { renderQuadComponent } from "./components/quad";

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

    for (const componentData of data) {
      switch (componentData.componentId) {
        case "quad-component":
          manialinks.push(await renderQuadComponent(componentData.attributes));
          break;
        case "label-component":
          manialinks.push(await renderLabelComponent(componentData.attributes));
          break;
        default:
          console.warn(`Unknown component id: ${componentData.componentId}`);
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
