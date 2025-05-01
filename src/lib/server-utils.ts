"use server";
import fs from "fs";
import path from "path";

export async function getFiles(
  directory: string,
  regexp: RegExp,
): Promise<string[]> {
  let results: string[] = [];

  const files = fs.readdirSync(directory);

  for (const file of files) {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      results = results.concat(await getFiles(filePath, regexp));
    } else if (regexp.test(file)) {
      results.push(filePath);
    }
  }

  return results;
}
