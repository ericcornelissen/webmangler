import type {
  EmbedsGetter,
  ExpressionFactory,
} from "@webmangler/language-utils";
import type { WebManglerLanguagePlugin } from "@webmangler/types";

import { SimpleLanguagePlugin } from "@webmangler/language-utils";

/**
 * The constructor type of the {@link HtmlLanguagePlugin} class.
 */
type HtmlLanguagePluginConstructor = new (
  options?: HtmlLanguagePluginOptions
) => WebManglerLanguagePlugin;

/**
 * The interface defining the dependencies of the {@link HtmlLanguagePlugin}
 * class.
 */
interface HtmlLanguagePluginDependencies {
  /**
   * Get all the embed finders for a new {@link HtmlLanguagePlugin} instance.
   *
   * @param options The plugin options.
   * @returns The embed finders.
   */
  getEmbedFinders(
    options: unknown,
  ): Iterable<EmbedsGetter>;

  /**
   * Get all the expression factories for a new {@link HtmlLanguagePlugin}
   * instance.
   *
   * @param options The plugin options.
   * @returns The expression factories {@link Map}.
   */
  getExpressionFactories(
    options: unknown,
  ): Map<string, ExpressionFactory>;

  /**
   * Get all the languages for a new {@link HtmlLanguagePlugin} instance.
   *
   * @param options The plugin options.
   * @param [options.htmlExtensions] The configured languages, if any.
   * @returns All languages the {@link HtmlLanguagePlugin} should support.
   */
  getLanguages(options: {
    htmlExtensions?: Iterable<string>;
  }): Iterable<string>;
}

/**
 * The options for _WebMangler_'s built-in {@link HtmlLanguagePlugin}.
 *
 * @since v0.1.17
 */
interface HtmlLanguagePluginOptions {
  /**
   * One or more extensions that the {@link HtmlLanguagePlugin} should be used
   * for. This can be used when HTML files have a non-standard extension or to
   * use this plugin for HTML-like languages.
   *
   * NOTE: the default extensions are always included and do not need to be
   * specified when using this option.
   *
   * @default `[]`
   * @since v0.1.17
   */
  htmlExtensions?: Iterable<string>;
}

/**
 * Initialize the {@link HtmlLanguagePlugin} class with explicit
 * dependencies.
 *
 * @param helpers The dependencies of the class.
 * @param helpers.getEmbedFinders A function to get embed finders.
 * @param helpers.getExpressionFactories A function to get expression factories.
 * @param helpers.getLanguages A function to get supported language extensions.
 * @returns The {@link HtmlLanguagePlugin} class.
 */
function initHtmlLanguagePlugin({
  getEmbedFinders,
  getExpressionFactories,
  getLanguages,
}: HtmlLanguagePluginDependencies): HtmlLanguagePluginConstructor {
  return class HtmlLanguagePlugin extends SimpleLanguagePlugin {
    /**
     * Instantiate a new {@link HtmlLanguagePlugin} plugin.
     *
     * @param [options] The {@link HtmlLanguagePluginOptions}.
     * @since v0.1.0
     * @version v0.1.17
     */
    constructor(options: HtmlLanguagePluginOptions={}) {
      super({
        embedsGetters: getEmbedFinders(options),
        expressionFactories: getExpressionFactories(options),
        languages: getLanguages(options),
      });
    }
  };
}

export default initHtmlLanguagePlugin;

export type {
  HtmlLanguagePluginOptions,
};
