import { QuadSchemaType } from "@/components/interface/components/quad/quad-schema";
import { Handlebars } from "@/lib/handlebars";
import fs from "fs/promises";
import path from "path";
import "server-only";

export async function renderQuadComponent(
  attributes: QuadSchemaType,
): Promise<string> {
  const templatePath = path.resolve(
    process.cwd(),
    "src/lib/manialink/components/quad.hbs",
  );

  const templateSource = await fs.readFile(templatePath, "utf-8");
  const template = Handlebars.compile(templateSource);
  return template(attributes);
}
