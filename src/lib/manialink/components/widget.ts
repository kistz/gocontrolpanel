import Manialink from "./manialink";

export default class Widget extends Manialink {
  template: string = "src/lib/manialink/templates/widget.xml.twig";
  data: Record<string, any> = {
    pos: { x: 0, y: 0 },
  };
}
