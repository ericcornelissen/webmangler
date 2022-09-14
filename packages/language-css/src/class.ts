import type {
  EmbedsGetter,
  ExpressionFactory,
} from "@webmangler/language-utils";
import type { WebManglerLanguagePlugin } from "@webmangler/types";

import { SimpleLanguagePlugin } from "@webmangler/language-utils";

/**
 * The constructor type of the {@link CssLanguagePlugin} class.
 */
type CssLanguagePluginConstructor = new (
  options?: CssLanguagePluginOptions
) => WebManglerLanguagePlugin;

/**
 * The interface defining the dependencies of the {@link CssLanguagePlugin}
 * class.
 */
interface CssLanguagePluginDependencies {
  /**
   * Get all the embed finders for a new {@link CssLanguagePlugin} instance.
   *
   * @returns The embed finders.
   */
  getEmbedFinders(
    options: unknown,
  ): Iterable<EmbedsGetter>;

  /**
   * Get all the expression factories for a new {@link CssLanguagePlugin}
   * instance.
   *
   * @param options The plugin options.
   * @returns The expression factories {@link Map}.
   */
  getExpressionFactories(
    options: unknown,
  ): ReadonlyMap<string, ExpressionFactory>;

  /**
   * Get all the languages for a new {@link CssLanguagePlugin} instance.
   *
   * @param options The plugin options.
   * @param [options.cssExtensions] The configured extensions, if any.
   * @returns The languages for the instances.
   */
  getLanguages(options: {
    readonly cssExtensions?: Iterable<string>;
  }): Iterable<string>;
}

/**
 * The options for _WebMangler_'s built-in {@link CssLanguagePlugin}.
 *
 * @since v0.1.17
 * @version v0.1.30
 */
interface CssLanguagePluginOptions {
  /**
   * One or more extensions that the {@link CssLanguagePlugin} should be used
   * for. This can be used when CSS files have a non-standard extension or to
   * use this plugin for CSS-like languages.
   *
   * NOTE: the default extensions are always included and do not need to be
   * specified when using this option.
   *
   * @default ["css"]
   * @since v0.1.17
   * @version v0.1.30
   */
  readonly cssExtensions?: Iterable<string>;
}

/**
 * Initialize the {@link CssLanguagePlugin} class with explicit dependencies.
 *
 * @param helpers The dependencies of the class.
 * @param helpers.getEmbedFinders A function to get embed finders.
 * @param helpers.getExpressionFactories A function to get expression factories.
 * @param helpers.getLanguages A function to get supported language extensions.
 * @returns The {@link CssLanguagePlugin} class.
 */
function initCssLanguagePlugin({
  getEmbedFinders,
  getExpressionFactories,
  getLanguages,
}: CssLanguagePluginDependencies): CssLanguagePluginConstructor {
  return class CssLanguagePlugin extends SimpleLanguagePlugin {
    /**
     * Instantiate a new {@link CssLanguagePlugin} plugin.
     *
     * @param [options] The {@link CssLanguagePluginOptions}.
     * @since v0.1.0
     * @version v0.1.17
     */
    constructor(options: CssLanguagePluginOptions={}) {
      super({
        embedsGetters: getEmbedFinders(options),
        expressionFactories: getExpressionFactories(options),
        languages: getLanguages(options),
      });
    }
  };
}

export default initCssLanguagePlugin;

export type {
  CssLanguagePluginOptions,
};
