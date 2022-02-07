import type { TestValuesSets } from "@webmangler/testing";

import type { BuiltInManglersOptions } from "../../types";

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
  disableHtmlIdMangling: booleanOptional,

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

  idAttributes: stringsOptional,
  idNamePattern: stringOrStringsOptional,
  keepIdPrefix: stringOptional,
  reservedIds: stringsOptional,
  urlAttributes: stringsOptional,
} as TestValuesSets<keyof BuiltInManglersOptions>;
