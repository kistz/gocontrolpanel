"use server";

import { doServerActionWithAuth } from "@/lib/actions";
import { getGbxClient } from "@/lib/gbxclient";
import { Interfaces } from "@/lib/prisma/generated";
import { getManialinkPosition, getManialinkSize } from "@/lib/utils";
import { ServerResponse } from "@/types/responses";
import { renderLocalRecordsWidget } from "./local-records";
import { LocalRecordsSchemaType } from "@/components/interface/widgets/local-records/local-records-schema";

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
    const data = JSON.parse(interfaceData.interfaceString);

    // Hide any existing Manialink pages before rendering the new interface
    const client = await getGbxClient(interfaceData.serverUuid);
    await client.call("SendHideManialinkPage");

    for (const widgetData of data) {
      switch (widgetData.id) {
        case "local-records-widget":
          await renderLocalRecordsWidget(
            interfaceData.serverUuid,
            records,
            getManialinkPosition(widgetData.positionPercentage),
            getManialinkSize(widgetData.sizePercentage),
            widgetData.attributes as LocalRecordsSchemaType,
          );
          break;
        default:
          console.warn(`Unknown widget id: ${widgetData.id}`);
      }
    }
  });
}
