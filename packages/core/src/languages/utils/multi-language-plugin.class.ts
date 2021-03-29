import type { MangleExpression, WebManglerLanguagePlugin } from "../../types";

/**
 * The {@link MultiLanguagePlugin} class is a utility to create a {@link
 * WebManglerLanguagePlugin} that provides multiple language plugins in one.
 *
 * {@link MultiLanguagePlugin} is used to implement the {@link
 * BuiltInLanguagesPlugin}.
 *
 * @since v0.1.0
 * @version v0.1.17
 */
export default abstract class MultiLanguagePlugin
    implements WebManglerLanguagePlugin {
  /**
   * the languages supported by the {@link MultiLanguagePlugin}.
   */
  private readonly languages: string[];

  /**
   * The {@link WebManglerLanguagePlugin}s in the {@link MultiLanguagePlugin}.
   */
  private readonly plugins: Iterable<WebManglerLanguagePlugin>;

  /**
   * Initialize a {@link WebManglerLanguagePlugin} with a fixed set of language
   * plugins.
   *
   * @param plugins The plugins to include in the {@link MultiLanguagePlugin}.
   * @since v0.1.0
   * @version v0.1.17
   */
  constructor(plugins: Iterable<WebManglerLanguagePlugin>) {
    this.languages = [];
    this.plugins = plugins;

    for (const plugin of plugins) {
      this.languages.push(...plugin.getLanguages());
    }
  }

  /**
   * @inheritDoc
   * @version v0.1.17
   */
  getExpressions(
    name: string,
    options: unknown,
  ): Map<string, Iterable<MangleExpression>> {
    const result: Map<string, Iterable<MangleExpression>> = new Map();
    for (const plugin of this.plugins) {
      const pluginExpressions = plugin.getExpressions(name, options);
      pluginExpressions.forEach((expr, lang) => result.set(lang, expr));
    }

    return result;
  }

  /**
   * Will return all the languages supported by every plugin in the {@link
   * MultiLanguagePlugin}.
   *
   * @inheritDoc
   * @version v0.1.17
   */
  getLanguages(): Iterable<string> {
    return this.languages;
  }
}
