"use server";
import { getGbxClient } from "@/lib/gbxclient";
import path from "path";
import twig from "twig";

const template = path.resolve(
  process.cwd(),
  "src/lib/manialink/widgets/local-records.xml.twig",
);

export async function renderLocalRecordsWidget(
  serverUuid: string,
  records: { player: string; time: number }[] = [],
  pos = { x: 0, y: 0 },
  size = { width: 140, height: 210 },
) {
  const data = {
    records,
    pos,
    size,
    id: "1",
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
