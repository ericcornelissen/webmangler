import type {
  CssDeclarationPropertyOptions,
  CssDeclarationValueOptions,
  MangleExpressionOptions,
} from "@webmangler/types";

/**
 * Get the {@link MangleExpressionOptions} for mangling CSS variable
 * definitions.
 *
 * @returns The {@link MangleExpressionOptions}.
 */
function getCssVariableDefinitionExpressionOptions():
    MangleExpressionOptions<CssDeclarationPropertyOptions> {
  return {
    name: "css-declaration-properties",
    options: {
      prefix: /--/.source,
    },
  };
}

/**
 * Get the {@link MangleExpressionOptions} for mangling CSS variable usage.
 *
 * @returns The {@link MangleExpressionOptions}.
 */
function getCssVariableUsageExpressionOptions():
    MangleExpressionOptions<CssDeclarationValueOptions> {
  return {
    name: "css-declaration-values",
    options: {
      kind: "function",
      prefix: /(?:VAR|VAr|VaR|Var|vAR|vAr|vaR|var)\s*\(\s*--/.source,
      suffix: /\s*(,[^)]+)?\)/u.source,
    },
  };
}

export {
  getCssVariableDefinitionExpressionOptions,
  getCssVariableUsageExpressionOptions,
};
