import fs from "fs";
import {
  createSynchronousEnvironment,
  createSynchronousFilesystemLoader,
  createSynchronousFilter,
  TwingSynchronousExecutionContext,
} from "twing";

const loader = createSynchronousFilesystemLoader(fs);
export const environment = createSynchronousEnvironment(loader, {
  charset: "utf-8",
  parserOptions: { level: 3 },
});

environment.addFilter(createSynchronousFilter("padding", paddingFilter, []));
environment.addFilter(createSynchronousFilter("position", positionFilter, []));
environment.addFilter(createSynchronousFilter("border", borderFilter, []));
environment.addFilter(
  createSynchronousFilter("min", minFilter, [
    {
      name: "min",
      defaultValue: 0,
    },
  ]),
);

function paddingFilter(_: TwingSynchronousExecutionContext, value: any) {
  return value / 4;
}

function positionFilter(_: TwingSynchronousExecutionContext, value: any) {
  return value / 3;
}

function borderFilter(_: TwingSynchronousExecutionContext, value: any) {
  return value / 4;
}

function minFilter(
  _: TwingSynchronousExecutionContext,
  value: any,
  min: number,
) {
  return Math.max(value, min);
}
