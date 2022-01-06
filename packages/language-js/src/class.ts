import type { WebManglerLanguagePlugin } from "@webmangler/types";
import type { ExpressionFactory } from "@webmangler/language-utils";

import { SimpleLanguagePlugin } from "@webmangler/language-utils";

/**
 * The constructor type of the {@link JavaScriptLanguagePlugin} class.
 */
type JavaScriptLanguagePluginConstructor = new (
  options?: JavaScriptLanguagePluginOptions
) => WebManglerLanguagePlugin;

/**
 * The interface defining the dependencies of the
 * {@link JavaScriptLanguagePlugin} class.
 */
interface JavaScriptLanguagePluginDependencies {
  /**
   * Get all the expression factories for a new {@link JavaScriptLanguagePlugin}
   * instance.
   *
   * @param options The options.
   * @returns The expression factories {@link Map}.
   */
  getExpressionFactories(
    options: Record<never, never>,
  ): Map<string, ExpressionFactory>;

  /**
   * Get all the languages for a new {@link JavaScriptLanguagePlugin} instance.
   *
   * @param options The options.
   * @param [options.jsExtensions] The configured languages, if any.
   */
  getLanguages(options: {
    jsExtensions?: Iterable<string>;
  }): Iterable<string>;
}

/**
 * The options for _WebMangler_'s built-in {@link JavaScriptLanguagePlugin}.
 *
 * @since v0.1.17
 */
interface JavaScriptLanguagePluginOptions {
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
 * Initialize the {@link JavaScriptLanguagePlugin} class with explicit
 * dependencies.
 *
 * @param helpers The dependencies of the class.
 * @param helpers.getExpressionFactories A function to get expression factories.
 * @param helpers.getLanguages A function to get supported language extensions.
 * @returns The {@link JavaScriptLanguagePlugin} class.
 */
function initJavaScriptLanguagePlugin({
  getExpressionFactories,
  getLanguages,
}: JavaScriptLanguagePluginDependencies): JavaScriptLanguagePluginConstructor {
  return class JavaScriptLanguagePlugin extends SimpleLanguagePlugin {
    /**
     * Instantiate a new {@link JavaScriptLanguagePlugin} plugin.
     *
     * @param [options] The {@link JavaScriptLanguagePluginOptions}.
     * @since v0.1.0
     * @version v0.1.17
     */
    constructor(options: JavaScriptLanguagePluginOptions={}) {
      super(
        getLanguages(options),
        getExpressionFactories(options),
      );
    }
  };
}

export default initJavaScriptLanguagePlugin;

export type {
  JavaScriptLanguagePluginOptions,
};
