import type { TestValuesSets } from "@webmangler/testing";

import type { BuiltInLanguagesOptions } from "../../types";

import { stringOrStringsOptional } from "../../../../__tests__/common";

const optionsValues = {
  cssExtensions: stringOrStringsOptional,
  htmlExtensions: stringOrStringsOptional,
  jsExtensions: stringOrStringsOptional,
} as TestValuesSets<keyof BuiltInLanguagesOptions>;

export {
  optionsValues,
};
