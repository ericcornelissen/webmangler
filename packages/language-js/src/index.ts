import type { JavaScriptLanguagePluginOptions } from "./class";

import initJavaScriptLanguagePlugin from "./class";
import * as helpers from "./helpers";

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
 * @version v0.1.24
 */
const JavaScriptLanguagePlugin = initJavaScriptLanguagePlugin({
  getExpressionFactories: helpers.getExpressionFactories,
  getLanguages: helpers.getLanguages,
});

export default JavaScriptLanguagePlugin;

export type {
  JavaScriptLanguagePluginOptions,
};
