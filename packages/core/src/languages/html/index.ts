import type { EmbedsGetter, ExpressionFactory } from "../utils";

import { SimpleLanguagePlugin } from "../utils";
import {
  embeddedCssFinders,
  embeddedJsFinders,
} from "./embeds";
import {
  attributeExpressionFactory,
  multiValueAttributeExpressionFactory,
  singleValueAttributeExpressionFactory,
} from "./expressions";

const map: Map<string, ExpressionFactory> = new Map();
map.set("attributes", attributeExpressionFactory);
map.set("multi-value-attributes", multiValueAttributeExpressionFactory);
map.set("single-value-attributes", singleValueAttributeExpressionFactory);

/**
 * The options for _WebMangler_'s built-in {@link HtmlLanguagePlugin}.
 *
 * @since v0.1.17
 */
export type HtmlLanguagePluginOptions = {
  /**
   * One or more extensions that the {@link HtmlLanguagePlugin} should be used
   * for. This can be used when HTML files have a non-standard extension or to
   * use this plugin for HTML-like languages.
   *
   * NOTE: the default extensions are always included and do not need to be
   * specified when using this option.
   *
   * @default `[]`
   * @since v0.1.17
   */
  htmlExtensions?: Iterable<string>;
}

/**
 * This {@link WebManglerLanguagePlugin} provides support for mangling the
 * following in HTML:
 *
 * - Attributes
 * - CSS declaration properties
 * - CSS declaration values
 * - Multi-value attribute values
 * - Single-value attribute values
 *
 * @example
 * webmangler({
 *   plugins: [
 *     // any compatible plugins, e.g. the built-in plugins
 *   ],
 *   languages: [
 *     new HtmlLanguagePlugin(),
 *   ],
 * });
 * @example
 * webmangler({
 *   plugins: [
 *     // any compatible plugins, e.g. the built-in plugins
 *   ],
 *   languages: [
 *     new HtmlLanguagePlugin({
 *       htmlExtensions: ["html5"], // e.g. "index.html5"
 *     }),
 *   ],
 * });
 * @since v0.1.0
 * @version v0.1.23
 */
export default class HtmlLanguagePlugin extends SimpleLanguagePlugin {
  /**
   * The language aliases supported by the {@link HtmlLanguagePlugin}.
   */
  private static DEFAULT_LANGUAGES: string[] = [
    "html",
    "xhtml",
  ];

  /**
   * The {@link EmbedsGetter}s used by the {@link HtmlLanguagePlugin}.
   */
  private static EMBEDS_GETTERS: EmbedsGetter[] = [
    ...embeddedCssFinders,
    ...embeddedJsFinders,
  ];

  /**
   * The {@link ExpressionFactory}s provided by the {@link HtmlLanguagePlugin}.
   */
  private static EXPRESSION_FACTORIES: Map<string, ExpressionFactory> = map;

  /**
   * Instantiate a new {@link HtmlLanguagePlugin} plugin.
   *
   * @param [options] The {@link HtmlLanguagePluginOptions}.
   * @since v0.1.0
   * @version v0.1.17
   */
  constructor(options: HtmlLanguagePluginOptions={}) {
    super(
      HtmlLanguagePlugin.getLanguages(options.htmlExtensions),
      HtmlLanguagePlugin.EXPRESSION_FACTORIES,
      HtmlLanguagePlugin.EMBEDS_GETTERS,
    );
  }

  /**
   * Get all the languages for a new {@link HtmlLanguagePlugin} instance.
   *
   * @param configuredLanguages The configured languages, if any.
   * @returns The languages for the instances.
   */
  private static getLanguages(
    configuredLanguages: Iterable<string> = [],
  ): Iterable<string> {
    return new Set([
      ...HtmlLanguagePlugin.DEFAULT_LANGUAGES,
      ...configuredLanguages,
    ]);
  }
}
