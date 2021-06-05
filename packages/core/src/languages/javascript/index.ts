import type { ExpressionFactory } from "../utils";

import { SimpleLanguagePlugin } from "../utils";
import cssDeclarationPropertyExpressionFactory from "./css-properties";
import querySelectorExpressionFactory from "./query-selectors";

const map: Map<string, ExpressionFactory> = new Map();
map.set("css-declaration-properties", cssDeclarationPropertyExpressionFactory);
map.set("query-selectors", querySelectorExpressionFactory);

/**
 * The options for _WebMangler_'s built-in {@link JavaScriptLanguagePlugin}.
 *
 * @since v0.1.17
 */
export type JavaScriptLanguagePluginOptions = {
  /**
   * One or more extensions that the {@link JavaScriptLanguagePlugin} should be
   * used for. This can be used when JavaScript files have a non-standard
   * extension or to use this plugin for JavaScript-like languages.
   *
   * NOTE: the default extensions are always included and do not need to be
   * specified when using this option.
   *
   * @default `[]`
   * @since v0.1.17
   */
  jsExtensions?: Iterable<string>;
}

/**
 * This {@link WebManglerLanguagePlugin} provides support for mangling the
 * following in JavaScript:
 *
 * - CSS declaration properties
 * - Query selectors
 *
 * @example
 * webmangler({
 *   plugins: [
 *     // any compatible plugins, e.g. the built-in plugins
 *   ],
 *   languages: [
 *     new JavaScriptLanguagePlugin(),
 *   ],
 * });
 * @example
 * webmangler({
 *   plugins: [
 *     // any compatible plugins, e.g. the built-in plugins
 *   ],
 *   languages: [
 *     new JavaScriptLanguagePlugin({
 *       jsExtensions: ["javascript"], // e.g. "script.javascript"
 *     }),
 *   ],
 * });
 * @since v0.1.0
 * @version v0.1.22
 */
export default class JavaScriptLanguagePlugin extends SimpleLanguagePlugin {
  /**
   * The language aliases supported by the {@link JavaScriptLanguagePlugin}.
   */
  private static DEFAULT_LANGUAGES: string[] = [
    "js",
    "cjs",
    "mjs",
  ];

  /**
   * The {@link ExpressionFactory}s provided by the {@link
   * JavaScriptLanguagePlugin}.
   */
  private static EXPRESSION_FACTORIES: Map<string, ExpressionFactory> = map;

  /**
   * Instantiate a new {@link JavaScriptLanguagePlugin} plugin.
   *
   * @param [options] The {@link CssLanguagePluginOptions}.
   * @since v0.1.0
   * @version v0.1.17
   */
  constructor(options: JavaScriptLanguagePluginOptions={}) {
    super(
      JavaScriptLanguagePlugin.getLanguages(options.jsExtensions),
      JavaScriptLanguagePlugin.EXPRESSION_FACTORIES,
    );
  }

  /**
   * Get all the languages for a new {@link JavaScriptLanguagePlugin} instance.
   *
   * @param configuredLanguages The configured languages, if any.
   * @returns The languages for the instances.
   */
  private static getLanguages(
    configuredLanguages: Iterable<string> = [],
  ): Iterable<string> {
    return new Set([
      ...JavaScriptLanguagePlugin.DEFAULT_LANGUAGES,
      ...configuredLanguages,
    ]);
  }
}
