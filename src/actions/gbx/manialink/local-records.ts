"use server";
import { getGbxClient } from "@/lib/gbxclient";
import path from "path";
import twig from "twig";
import { v4 as uuidv4 } from "uuid";

const template = path.resolve(
  process.cwd(),
  "src/lib/manialink/widgets/local-records.xml.twig",
);

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
    title: {
      text: "Records",
      font: "RobotoCondensedBold",
    },
    record: {
      padding: {
        left: 2 / 4,
        right: 2 / 4,
        top: 1 / 4,
        bottom: 1 / 4,
      },
      border: {
        color: "8888",
        bottom: 1 / 4,
        top: 0 / 4,
        left: 0 / 4,
        right: 0 / 4,
      },
      position: {
        width: 4,
        font: "RobotoCondensedBold",
        color: "FFF",
      },
      player: {
        font: "RobotoCondensed",
        color: "FFF",
        padding: {
          left: 4 / 4,
          right: 0 / 4,
          top: 1 / 4,
          bottom: 1 / 4,
        }
      },
      time: {
        font: "RobotoCondensedBold",
        color: "0C6",
        padding: {
          left: 2 / 4,
          right: 0 / 4,
          top: 1 / 4,
          bottom: 1 / 4,
        }
      },
    },
    id: uuidv4(),
  };

  twig.cache(false);

  const manialink = await new Promise((resolve, reject) => {
    twig.renderFile(template, data, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });

  const client = await getGbxClient(serverUuid);
  await client.call("SendDisplayManialinkPage", manialink, 0, false);
}
