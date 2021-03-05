import type { ExpressionFactory } from "../utils/simple-language-plugin.class";

import SimpleLanguagePlugin from "../utils/simple-language-plugin.class";
import attributeExpressionFactory from "./attributes";
import cssDeclarationPropertyExpressionFactory from "./css-properties";
import cssDeclarationValueExpressionFactory from "./css-values";
import multiValueAttributeExpressionFactory from "./multi-value-attributes";
import singleValueAttributeExpressionFactory from "./single-value-attributes";

const map: Map<string, ExpressionFactory> = new Map();
map.set("attributes", attributeExpressionFactory);
map.set("css-declaration-properties", cssDeclarationPropertyExpressionFactory);
map.set("css-declaration-values", cssDeclarationValueExpressionFactory);
map.set("multi-value-attributes", multiValueAttributeExpressionFactory);
map.set("single-value-attributes", singleValueAttributeExpressionFactory);

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
 *
 * @since v0.1.0
 * @version v0.1.15
 */
export default class HtmlLanguagePlugin extends SimpleLanguagePlugin {
  /**
   * The language aliases supported by the {@link HtmlLanguagePlugin}.
   */
  private static languages: string[] = [
    "html",
    "xhtml",
  ];

  /**
   * The {@link ExpressionFactory}s provided by the {@link HtmlLanguagePlugin}.
   */
  private static expressionFactories: Map<string, ExpressionFactory> = map;

  /**
   * Instantiate a new {@link HtmlLanguagePlugin} plugin.
   */
  constructor() {
    super(
      HtmlLanguagePlugin.languages,
      HtmlLanguagePlugin.expressionFactories,
    );
  }
}
