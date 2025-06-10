"use server";
import { LocalRecordsSchemaType } from "@/components/interface/widgets/local-records/local-records-schema";
import { getGbxClient } from "@/lib/gbxclient";
import { environment } from "@/lib/twig";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function renderLocalRecordsWidget(
  serverUuid: string,
  records: { player: string; time: number }[],
  pos: { x: number; y: number },
  size: { width: number; height: number },
  attributes: LocalRecordsSchemaType,
) {
  const data = {
    records,
    pos,
    size,
    ...attributes,
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
