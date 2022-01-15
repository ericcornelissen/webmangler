import type { ExpressionFactory } from "@webmangler/language-utils";

import * as factories from "./expressions";

/**
 * The language aliases supported by the {@link CssLanguagePlugin}.
 */
const DEFAULT_LANGUAGES: Iterable<string> = [
  "css",
];

/**
 * Get all the expression factories for a new {@link CssLanguagePlugin}
 * instance.
 *
 * @returns The expression factories {@link Map}.
 */
function getExpressionFactories(): Map<string, ExpressionFactory> {
  const expressionFactories: Map<string, ExpressionFactory> = new Map();
  expressionFactories.set(
    "css-declaration-properties",
    factories.cssDeclarationPropertyExpressionFactory,
  );
  expressionFactories.set(
    "css-declaration-values",
    factories.cssDeclarationValueExpressionFactory,
  );
  expressionFactories.set(
    "multi-value-attributes",
    factories.multiValueAttributeExpressionFactory,
  );
  expressionFactories.set(
    "query-selectors",
    factories.querySelectorExpressionFactory,
  );
  expressionFactories.set(
    "single-value-attributes",
    factories.singleValueAttributeExpressionFactory,
  );

  return expressionFactories;
}

/**
 * Get all the languages for a new {@link CssLanguagePlugin} instance.
 *
 * @param [configuredLanguages] The configured languages, if any.
 * @returns The languages for the instances.
 */
function getLanguages(
  configuredLanguages: Iterable<string> = [],
): Iterable<string> {
  return new Set([
    ...DEFAULT_LANGUAGES,
    ...configuredLanguages,
  ]);
}

export {
  getExpressionFactories,
  getLanguages,
};
