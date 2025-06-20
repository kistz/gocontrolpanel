import { LabelSchemaType } from "@/components/interface/components/label/label-schema";
import { Handlebars } from "@/lib/handlebars";
import fs from "fs/promises";
import path from "path";

export async function renderLabelComponent(
  attributes: LabelSchemaType,
): Promise<string> {
  const templatePath = path.resolve(
    process.cwd(),
    "src/lib/manialink/components/label.hbs",
  );

  const templateSource = await fs.readFile(templatePath, "utf-8");
  const template = Handlebars.compile(templateSource);
  return template(attributes);
}
