import type { HtmlLanguagePluginOptions } from "./class";

import initHtmlLanguagePlugin from "./class";
import * as helpers from "./helpers";

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
const HtmlLanguagePlugin = initHtmlLanguagePlugin({
  getEmbedFinders: helpers.getEmbedFinders,
  getExpressionFactories: helpers.getExpressionFactories,
  getLanguages: helpers.getLanguages,
});

export default HtmlLanguagePlugin;

export type {
  HtmlLanguagePluginOptions,
};
