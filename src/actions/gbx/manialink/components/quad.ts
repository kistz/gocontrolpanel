"use server";

import { QuadSchemaType } from "@/components/interface/components/quad/quad-schema";
import { environment } from "@/lib/twig";
import path from "path";

export async function renderQuadComponent(
  attributes: QuadSchemaType,
): Promise<string> {
  const template = environment.loadTemplate(
    `${path.resolve(
      process.cwd(),
      "src/lib/manialink/components/quad.xml.twig",
    )}`,
    "utf-8",
  );

  const manialink = template.render(
    environment,
    new Map(Object.entries(attributes)),
  );

  return manialink;
}
