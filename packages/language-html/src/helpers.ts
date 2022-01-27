import type {
  EmbedsGetter,
  ExpressionFactory,
} from "@webmangler/language-utils";

import * as factories from "./expressions";
import * as embeds from "./embeds";

/**
 * The language aliases supported by the {@link HtmlLanguagePlugin}.
 */
const DEFAULT_LANGUAGES: Iterable<string> = [
  "html",
  "xhtml",
];

/**
 * The embed finders for the {@link HtmlLanguagePlugin}.
 */
const EMBEDS_FINDERS: Iterable<EmbedsGetter> = [
  ...embeds.embeddedCssFinders,
  ...embeds.embeddedJsFinders,
];

/**
 * Get the embed finders for a new {@link HtmlLanguagePlugin} instance.
 *
 * @returns The embed finders.
 */
function getEmbedFinders(): Iterable<EmbedsGetter> {
  return EMBEDS_FINDERS;
}

/**
 * Get all the expression factories for a new {@link HtmlLanguagePlugin}
 * instance.
 *
 * @returns The expression factories {@link Map}.
 */
function getExpressionFactories(): Map<string, ExpressionFactory> {
  const expressionFactories: Map<string, ExpressionFactory> = new Map();
  expressionFactories.set(
    "attributes",
    factories.attributeExpressionFactory,
  );
  expressionFactories.set(
    "multi-value-attributes",
    factories.multiValueAttributeExpressionFactory,
  );
  expressionFactories.set(
    "single-value-attributes",
    factories.singleValueAttributeExpressionFactory,
  );

  return expressionFactories;
}

/**
 * Get all the languages for a new {@link HtmlLanguagePlugin} instance.
 *
 * @param options The options.
 * @param [options.htmlExtensions] The configured languages, if any.
 * @returns The languages for the instances.
 */
function getLanguages(options: {
  htmlExtensions?: Iterable<string>;
}): Iterable<string> {
  const configuredLanguages = options.htmlExtensions || [];
  return new Set([
    ...DEFAULT_LANGUAGES,
    ...configuredLanguages,
  ]);
}

export {
  getEmbedFinders,
  getExpressionFactories,
  getLanguages,
};
