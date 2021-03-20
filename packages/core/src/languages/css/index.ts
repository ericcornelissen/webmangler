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
 * @since v0.1.0
 * @version v0.1.17
 */
export default class CssLanguagePlugin extends SimpleLanguagePlugin {
  /**
   * The language aliases supported by the {@link CssLanguagePlugin}.
   */
  private static languages: string[] = [
    "css",
  ];

  /**
   * The {@link ExpressionFactory}s provided by the {@link CssLanguagePlugin}.
   */
  private static expressionFactories: Map<string, ExpressionFactory> = map;

  /**
   * Instantiate a new {@link CssLanguagePlugin} plugin.
   */
  constructor() {
    super(
      CssLanguagePlugin.languages,
      CssLanguagePlugin.expressionFactories,
    );
  }
}
