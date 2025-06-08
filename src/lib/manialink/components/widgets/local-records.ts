import Widget from "../widget";

export default class LocalRecordsWidget extends Widget {
  template = "src/lib/manialink/templates/widgets/local-records.xml.twig";

  constructor(
    records: { player: string; time: number }[] = [],
    pos = { x: 0, y: 0 },
    size = { width: 140, height: 210 },
  ) {
    super();
    this.data = { records, pos, size };
  }
}
