import type { ExpressionFactory } from "../utils";

import { SimpleLanguagePlugin } from "../utils";
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
 * The options for _WebMangler_'s built-in {@link HtmlLanguagePlugin}.
 *
 * @since v0.1.17
 */
export type HtmlLanguagePluginOptions = {
  /**
   * One or more languages that this language plugin should be used for. Can be
   * used when HTML files have a non-standard extension or to use this plugin
   * for HTML-like languages.
   *
   * NOTE: the default languages are always included and do not need to be
   * specified when using this option.
   *
   * @default `[]`
   * @since v0.1.17
   */
  languages?: string[];
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
 *
 * @since v0.1.0
 * @version v0.1.17
 */
export default class HtmlLanguagePlugin extends SimpleLanguagePlugin {
  /**
   * The language aliases supported by the {@link HtmlLanguagePlugin}.
   */
  private static LANGUAGES: string[] = [
    "html",
    "xhtml",
  ];

  /**
   * The {@link ExpressionFactory}s provided by the {@link HtmlLanguagePlugin}.
   */
  private static EXPRESSION_FACTORIES: Map<string, ExpressionFactory> = map;

  /**
   * Instantiate a new {@link HtmlLanguagePlugin} plugin.
   *
   * @param options The {@link HtmlLanguagePluginOptions}.
   * @since v0.1.0
   * @version v0.1.17
   */
  constructor(options: HtmlLanguagePluginOptions={}) {
    super(
      HtmlLanguagePlugin.getLanguages(options.languages),
      HtmlLanguagePlugin.EXPRESSION_FACTORIES,
    );
  }

  /**
   * Get all the languages for a new {@link HtmlLanguagePlugin} instance.
   *
   * @param configuredLanguages The configured languages, if any.
   * @returns The languages for the instances.
   */
  private static getLanguages(configuredLanguages: string[] = []): string[] {
    return HtmlLanguagePlugin.LANGUAGES.concat(...configuredLanguages);
  }
}
