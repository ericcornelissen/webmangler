import type { ExpressionFactory } from "../utils";

import { SimpleLanguagePlugin } from "../utils";
import cssDeclarationPropertyExpressionFactory from "./css-properties";
import cssDeclarationValueExpressionFactory from "./css-values";
import querySelectorExpressionFactory from "./query-selectors";
import singleValueAttributeExpressionFactory from "./single-value-attributes";

const map: Map<string, ExpressionFactory> = new Map();
map.set("css-declaration-properties", cssDeclarationPropertyExpressionFactory);
map.set("css-declaration-values", cssDeclarationValueExpressionFactory);
map.set("query-selectors", querySelectorExpressionFactory);
map.set("single-value-attributes", singleValueAttributeExpressionFactory);

/**
 * The options for _WebMangler_'s built-in {@link CssLanguagePlugin}.
 *
 * @since v0.1.17
 */
export type CssLanguagePluginOptions = {
  /**
   * One or more extensions that the {@link CssLanguagePlugin} should be used
   * for. This can be used when CSS files have a non-standard extension or to
   * use this plugin for CSS-like languages.
   *
   * NOTE: the default extensions are always included and do not need to be
   * specified when using this option.
   *
   * @default `[]`
   * @since v0.1.17
   */
  cssExtensions?: Iterable<string>;
}

/**
 * This {@link WebManglerLanguagePlugin} provides support for mangling the
 * following in CSS:
 *
 * - CSS declaration properties
 * - CSS declaration values
 * - Query selectors
 * - Single-value attribute values
 *
 * @example
 * webmangler({
 *   plugins: [
 *     // any compatible plugins, e.g. the built-in plugins
 *   ],
 *   languages: [
 *     new CssLanguagePlugin(),
 *   ],
 * });
 *
 * @example
 * webmangler({
 *   plugins: [
 *     // any compatible plugins, e.g. the built-in plugins
 *   ],
 *   languages: [
 *     new CssLanguagePlugin({
 *       cssExtensions: ["style"], // e.g. "main.style"
 *     }),
 *   ],
 * });
 *
 * @since v0.1.0
 * @version v0.1.21
 */
export default class CssLanguagePlugin extends SimpleLanguagePlugin {
  /**
   * The language aliases supported by the {@link CssLanguagePlugin}.
   */
  private static DEFAULT_LANGUAGES: string[] = [
    "css",
  ];

  /**
   * The {@link ExpressionFactory}s provided by the {@link CssLanguagePlugin}.
   */
  private static EXPRESSION_FACTORIES: Map<string, ExpressionFactory> = map;

  /**
   * Instantiate a new {@link CssLanguagePlugin} plugin.
   *
   * @param [options] The {@link CssLanguagePluginOptions}.
   * @since v0.1.0
   * @version v0.1.17
   */
  constructor(options: CssLanguagePluginOptions={}) {
    super(
      CssLanguagePlugin.getLanguages(options.cssExtensions),
      CssLanguagePlugin.EXPRESSION_FACTORIES,
    );
  }

  /**
   * Get all the languages for a new {@link CssLanguagePlugin} instance.
   *
   * @param configuredLanguages The configured languages, if any.
   * @returns The languages for the instances.
   */
  private static getLanguages(
    configuredLanguages: Iterable<string> = [],
  ): Iterable<string> {
    return new Set([
      ...CssLanguagePlugin.DEFAULT_LANGUAGES,
      ...configuredLanguages,
    ]);
  }
}
