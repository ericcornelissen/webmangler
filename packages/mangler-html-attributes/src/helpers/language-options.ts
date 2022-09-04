import type {
  AttributeOptions,
  CssDeclarationValueOptions,
  MangleExpressionOptions,
  QuerySelectorOptions,
} from "@webmangler/types";

/**
 * Get the {@link MangleExpressionOptions} for mangling attributes.
 *
 * @returns The {@link AttributeOptions}.
 */
function getAttributeExpressionOptions():
    MangleExpressionOptions<AttributeOptions> {
  return {
    name: "attributes",
    options: { },
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
      kind: "attribute",
      prefix: /\[\s*/.source,
      suffix: /\s*(?:]|(?:=|~=|\|=|\^=|\$=|\*=))/.source,
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
      prefix: /(?:ATTR|ATTr|ATtR|AtTR|ATtr|AtTr|AttR|Attr|aTTR|aTTr|aTtR|atTR|aTtr|atTr|attR|attr)\s*\(\s*/.source,
      suffix: /(\s+([a-zA-Z]+|%))?\s*(,[^)]+)?\)/.source,
    },
  };
}

export {
  getAttributeExpressionOptions,
  getAttributeSelectorExpressionOptions,
  getAttributeUsageExpressionFactory,
};
