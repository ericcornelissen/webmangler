import type {
  MangleExpression,
  ReadonlyCollection,
  WebManglerEmbed,
  WebManglerFile,
  WebManglerLanguagePlugin,
} from "@webmangler/types";

/**
 * The {@link MultiLanguagePlugin} class is a utility to create a
 * {@link WebManglerLanguagePlugin} that provides multiple language plugins in
 * one.
 *
 * @example
 * class MyMultiLanguagePlugin extends MultiLanguagePlugin {
 *   constructor() {
 *     super([
 *       new MyLanguagePluginA(),
 *       new MyLanguagePluginB(),
 *       // ...
 *     ]);
 *   }
 * }
 * @since v0.1.0
 * @version v0.1.28
 */
abstract class MultiLanguagePlugin implements WebManglerLanguagePlugin {
  /**
   * The languages supported by the {@link MultiLanguagePlugin}.
   */
  private readonly languages: ReadonlyCollection<string>;

  /**
   * The {@link WebManglerLanguagePlugin}s in the {@link MultiLanguagePlugin}.
   */
  private readonly plugins: ReadonlyCollection<WebManglerLanguagePlugin>;

  /**
   * Initialize a {@link WebManglerLanguagePlugin} with a fixed set of language
   * plugins.
   *
   * @param plugins The plugins to include in the {@link MultiLanguagePlugin}.
   * @since v0.1.0
   * @version v0.1.28
   */
  constructor(
    plugins: ReadonlyCollection<WebManglerLanguagePlugin>,
  ) {
    this.plugins = plugins;

    const languages: Set<string> = new Set();
    for (const plugin of plugins) {
      for (const language of plugin.getLanguages()) {
        languages.add(language);
      }
    }

    this.languages = languages;
  }

  /**
   * @inheritDoc
   * @version v0.1.28
   */
  getEmbeds(
    file: Readonly<WebManglerFile>,
  ): Iterable<WebManglerEmbed> {
    const result: WebManglerEmbed[] = [];
    for (const plugin of this.plugins) {
      const pluginEmbeds = plugin.getEmbeds(file);
      result.push(...pluginEmbeds);
    }

    return result;
  }

  /**
   * @inheritDoc
   * @version v0.1.26
   */
  getExpressions(
    name: string,
    options: unknown,
  ): ReadonlyMap<string, Iterable<MangleExpression>> {
    const result: Map<string, Iterable<MangleExpression>> = new Map();
    for (const plugin of this.plugins) {
      const pluginExpressions = plugin.getExpressions(name, options);
      pluginExpressions.forEach((expr, lang) => result.set(lang, expr));
    }

    return result;
  }

  /**
   * Will return all the languages supported by every plugin in the
   * {@link MultiLanguagePlugin}.
   *
   * @inheritDoc
   * @version v0.1.25
   */
  getLanguages(): Iterable<string> {
    return this.languages;
  }
}

export default MultiLanguagePlugin;
