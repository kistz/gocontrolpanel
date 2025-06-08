import path from "path";
import twig from "twig";

export default class Manialink {
  template = "src/lib/manialink/templates/manialink.xml.twig";
  id: string = "1";
  data: Record<string, any> = {};

  async render(): Promise<string> {
    return new Promise((resolve, reject) => {
      twig.renderFile(path.resolve(this.template), this.data, (err, html) => {
        if (err) return reject(err);
        resolve(html);
      });
    });
  }
}
