import type { MangleExpressionOptions } from "@webmangler/types";

import type {
  CssDeclarationPropertyOptions,
  CssDeclarationValueOptions,
} from "../types";

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
      prefix: "--",
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
      prefix: "var\\s*\\(\\s*--",
      suffix: "\\s*(,[^\\)]+)?\\)",
    },
  };
}

export {
  getCssVariableDefinitionExpressionOptions,
  getCssVariableUsageExpressionOptions,
};
