import type { MangleExpression } from "../../types";
import type { ExpressionFactory } from "../utils/simple-language-plugin.class";

import SimpleLanguagePlugin from "../utils/simple-language-plugin.class";

import attributeExpressionFactory from "./attributes";
import cssClassesMatchers from "./css-classes";
import cssDeclarationPropertyExpressionFactory from "./css-properties";
import cssDeclarationValueExpressionFactory from "./css-values";
import cssVariablesMatchers from "./css-variables";
import htmlAttributeMatchers from "./html-attributes";
import htmlIdMatchers from "./html-ids";
import multiValueAttributeExpressionFactory from "./multi-value-attributes";
import singleValueAttributeExpressionFactory from "./single-value-attributes";

const languages: string[] = ["html", "xhtml"];
const expressions: Map<string, MangleExpression[]> = new Map();

expressions.set("css-class-mangler", cssClassesMatchers);
expressions.set("css-variable-mangler", cssVariablesMatchers);
expressions.set("html-attribute-mangler", htmlAttributeMatchers);
expressions.set("html-id-mangler", htmlIdMatchers);

const map: Map<string, ExpressionFactory> = new Map();
map.set("attributes", attributeExpressionFactory);
map.set("cssDeclarationProperties", cssDeclarationPropertyExpressionFactory);
map.set("cssDeclarationValues", cssDeclarationValueExpressionFactory);
map.set("singleValueAttributes", singleValueAttributeExpressionFactory);
map.set("multiValueAttributes", multiValueAttributeExpressionFactory);

/**
 * This {@link WebManglerLanguagePlugin} provides HTML support for the built-in
 * {@link WebManglerPlugin}s.
 *
 * @example
 * webmangler({
 *   plugins: [], // any built-in plugin(s)
 *   languages: [new HtmlLanguageSupport()],
 * });
 *
 * @since v0.1.0
 * @version v0.1.14
 */
export default class HtmlLanguageSupport extends SimpleLanguagePlugin {
  /**
   * Instantiate a new {@link HtmlLanguageSupport} plugin.
   */
  constructor() {
    super(languages, expressions, map);
  }
}
