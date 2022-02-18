import type { TestValuesSets } from "@webmangler/testing";

import type { BuiltInManglersOptions } from "../../types";

import {
  booleanOptional,
  stringOptional,
  stringOrStringsOptional,
  stringsOptional,
} from "../../../../__tests__/common";

const optionsValues = {
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

export {
  optionsValues,
};
