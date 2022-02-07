import type { TestValuesSets } from "@webmangler/testing";

import type { RecommendedManglersOptions } from "../../types";

const booleanOptional = [
  undefined,
  true,
  false,
];

const stringOrStringsOptional = [
  undefined,
  "foobar",
  ["foo", "bar"],
];

const stringOptional = [
  undefined,
  "foobar",
];

const stringsOptional = [
  undefined,
  ["foo", "bar"],
];

export const optionsValues = {
  disableCssClassMangling: booleanOptional,
  disableCssVarMangling: booleanOptional,
  disableHtmlAttrMangling: booleanOptional,

  classAttributes: stringsOptional,
  classNamePattern: stringOrStringsOptional,
  keepClassNamePrefix: stringOptional,
  reservedClassNames: stringsOptional,

  cssVarNamePattern: stringOrStringsOptional,
  keepCssVarPrefix: stringOptional,
  reservedCssVarNames: stringsOptional,

  attrNamePattern: stringOrStringsOptional,
  keepAttrPrefix: stringOptional,
  reservedAttrNames: stringsOptional,
} as TestValuesSets<keyof RecommendedManglersOptions>;
