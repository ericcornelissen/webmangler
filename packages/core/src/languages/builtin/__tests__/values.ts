import type { TestValuesSets } from "@webmangler/testing";

import type { BuiltInLanguagesOptions } from "../types";

const stringOrStringsOptional = [
  undefined,
  "foobar",
  ["foo", "bar"],
];

export const optionsValues = {
  cssExtensions: stringOrStringsOptional,
  htmlExtensions: stringOrStringsOptional,
  jsExtensions: stringOrStringsOptional,
} as TestValuesSets<keyof BuiltInLanguagesOptions>;
