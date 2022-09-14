import type { ExpressionFactory } from "@webmangler/language-utils";

import * as factories from "./expressions";

/**
 * The language aliases supported by the {@link JavaScriptLanguagePlugin}.
 */
const DEFAULT_LANGUAGES: Iterable<string> = [
  "js",
  "cjs",
  "mjs",
];

/**
 * Get all the expression factories for a new {@link JavaScriptLanguagePlugin}
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
    "query-selectors",
    factories.querySelectorExpressionFactory,
  );

  return expressionFactories;
}

/**
 * Get all the languages for a new {@link JavaScriptLanguagePlugin} instance.
 *
 * @param options The options.
 * @param [options.jsExtensions] The configured languages, if any.
 * @returns The languages for the instances.
 */
function getLanguages(options: {
  readonly jsExtensions?: Iterable<string>;
}): Iterable<string> {
  const configuredLanguages = options.jsExtensions || [];
  return new Set([
    ...DEFAULT_LANGUAGES,
    ...configuredLanguages,
  ]);
}

export {
  getExpressionFactories,
  getLanguages,
};
