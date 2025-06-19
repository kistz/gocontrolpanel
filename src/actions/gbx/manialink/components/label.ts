"use server";

import { LabelSchemaType } from "@/components/interface/components/label/label-schema";
import { environment } from "@/lib/twig";
import path from "path";

export async function renderLabelComponent(
  attributes: LabelSchemaType,
): Promise<string> {
  const template = environment.loadTemplate(
    `${path.resolve(
      process.cwd(),
      "src/lib/manialink/components/label.xml.twig",
    )}`,
    "utf-8",
  );

  const manialink = template.render(
    environment,
    new Map(Object.entries(attributes)),
  );

  return manialink;
}
