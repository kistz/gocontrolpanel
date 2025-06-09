"use server";

import { doServerActionWithAuth } from "@/lib/actions";
import { Interfaces } from "@/lib/prisma/generated";
import { getManialinkPosition, getManialinkSize } from "@/lib/utils";
import { ServerResponse } from "@/types/responses";
import { renderLocalRecordsWidget } from "./local-records";

const records = [
  { player: "Marijntje04", time: 12345 },
  { player: "Marijntje04", time: 12345 },
  { player: "Marijntje04", time: 12345 },
  { player: "Marijntje04", time: 12345 },
  { player: "Marijntje04", time: 12345 },
  { player: "Marijntje04", time: 12345 },
  { player: "Marijntje04", time: 12345 },
  { player: "Marijntje04", time: 12345 },
  { player: "Marijntje04", time: 12345 },
  { player: "Marijntje04", time: 12345 },
];

export async function renderInterface(
  interfaceData: Interfaces,
): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const data = JSON.parse(interfaceData.interfaceString);

    for (const widgetData of data) {
      switch (widgetData.id) {
        case "local-records-widget":
          await renderLocalRecordsWidget(
            interfaceData.serverUuid,
            records,
            getManialinkPosition(widgetData.positionPercentage),
            getManialinkSize(widgetData.sizePercentage),
          );
          break;
        default:
          console.warn(`Unknown widget id: ${widgetData.id}`);
      }
    }
  });
}
