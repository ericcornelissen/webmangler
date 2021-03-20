import type { ExpressionFactory } from "../utils";

import { SimpleLanguagePlugin } from "../utils";
import cssDeclarationPropertyExpressionFactory from "./css-properties";
import querySelectorExpressionFactory from "./query-selectors";

const map: Map<string, ExpressionFactory> = new Map();
map.set("css-declaration-properties", cssDeclarationPropertyExpressionFactory);
map.set("query-selectors", querySelectorExpressionFactory);

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
 *
 * @since v0.1.0
 * @version v0.1.17
 */
export default class JavaScriptLanguagePlugin extends SimpleLanguagePlugin {
  /**
   * The language aliases supported by the {@link JavaScriptLanguagePlugin}.
   */
  private static languages: string[] = [
    "js",
    "cjs",
    "mjs",
  ];

  /**
   * The {@link ExpressionFactory}s provided by the {@link
   * JavaScriptLanguagePlugin}.
   */
  private static expressionFactories: Map<string, ExpressionFactory> = map;

  /**
   * Instantiate a new {@link JavaScriptLanguagePlugin} plugin.
   */
  constructor() {
    super(
      JavaScriptLanguagePlugin.languages,
      JavaScriptLanguagePlugin.expressionFactories,
    );
  }
}
