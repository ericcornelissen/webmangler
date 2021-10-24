import type { MangleExpressionOptions } from "@webmangler/types";

import type {
  AttributeOptions,
  CssDeclarationValueOptions,
  QuerySelectorOptions,
} from "../types";

/**
 * Get the {@link MangleExpressionOptions} for mangling attributes.
 *
 * @returns The {@link AttributeOptions}.
 */
function getAttributeExpressionOptions():
    MangleExpressionOptions<AttributeOptions> {
  return {
    name: "attributes",
    options: null,
  };
}

/**
 * Get the {@link MangleExpressionOptions} for mangling attributes query
 * selectors.
 *
 * @returns The {@link QuerySelectorOptions}.
 */
function getAttributeSelectorExpressionOptions():
    MangleExpressionOptions<QuerySelectorOptions> {
  return {
    name: "query-selectors",
    options: {
      prefix: "\\[\\s*",
      suffix: "\\s*(?:\\]|(?:=|~=|\\|=|\\^=|\\$=|\\*=))",
    },
  };
}

/**
 * Get the {@link MangleExpressionOptions} for mangling attribute usage in CSS
 * declarations.
 *
 * @returns The {@link AttributeOptions}.
 */
function getAttributeUsageExpressionFactory():
    MangleExpressionOptions<CssDeclarationValueOptions> {
  return {
    name: "css-declaration-values",
    options: {
      prefix: "attr\\s*\\(\\s*",
      suffix: "(\\s+([a-zA-Z]+|%))?\\s*(,[^)]+)?\\)",
    },
  };
}

export {
  getAttributeExpressionOptions,
  getAttributeSelectorExpressionOptions,
  getAttributeUsageExpressionFactory,
};
