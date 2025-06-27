import Handlebars from "handlebars";

Handlebars.registerHelper("boolToNum", (value: boolean) => (value ? 1 : 0));

export { Handlebars };
