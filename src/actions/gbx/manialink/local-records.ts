"use server";
import { getGbxClient } from "@/lib/gbxclient";
import { environment } from "@/lib/twig";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function renderLocalRecordsWidget(
  serverUuid: string,
  records: { player: string; time: number }[],
  pos: { x: number; y: number },
  size: { width: number; height: number },
) {
  const data = {
    records,
    pos,
    size,
    header: {
      text: "Records",
      font: "RobotoCondensedBold",
    },
    record: {
      padding: {
        left: 2,
        right: 2,
        top: 0,
        bottom: 0,
      },
      border: {
        color: "8888",
        bottom: 1,
        top: 0,
        left: 0,
        right: 0,
      },
      position: {
        width: 16,
        font: "RobotoCondensedBold",
        color: "FFF",
      },
      player: {
        font: "RobotoCondensed",
        color: "FFF",
        padding: {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        },
      },
      time: {
        font: "RobotoCondensedBold",
        color: "0C6",
        padding: {
          left: 2,
          right: 0,
          top: 0,
          bottom: 0,
        },
      },
    },
    id: uuidv4(),
  };

  const template = environment.loadTemplate(
    `${path.resolve(
      process.cwd(),
      "src/lib/manialink/widgets/local-records.xml.twig",
    )}`,
    "utf-8",
  );
  const manialink = template.render(environment, new Map(Object.entries(data)));

  const client = await getGbxClient(serverUuid);
  await client.call("SendDisplayManialinkPage", manialink, 0, false);
}
