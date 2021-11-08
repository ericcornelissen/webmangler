import type { CssLanguagePluginOptions } from "./class";

import initCssLanguagePlugin from "./class";
import * as helpers from "./helpers";

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
 * @since v0.1.0
 * @version v0.1.26
 */
const CssLanguagePlugin = initCssLanguagePlugin({
  getExpressionFactories: helpers.getExpressionFactories,
  getLanguages: helpers.getLanguages,
});

export default CssLanguagePlugin;

export type {
  CssLanguagePluginOptions,
};
