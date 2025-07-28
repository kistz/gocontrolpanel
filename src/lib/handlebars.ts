import Handlebars from "handlebars";

Handlebars.registerHelper("boolToNum", (value: boolean) => (value ? 1 : 0));

Handlebars.registerHelper(
  "ifEq",
  function (
    this: Handlebars.HelperOptions,
    a: any,
    b: any,
    options: Handlebars.HelperOptions,
  ) {
    return a === b ? options.fn(this) : options.inverse(this);
  },
);

export { Handlebars };
