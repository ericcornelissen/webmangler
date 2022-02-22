import type { TestValuesSets } from "@webmangler/testing";

import type { RecommendedManglersOptions } from "../../types";

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

export {
  optionsValues,
};
