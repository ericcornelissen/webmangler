import type {
  MangleExpression,
  WebManglerEmbed,
  WebManglerFile,
  WebManglerLanguagePlugin,
} from "@webmangler/types";

/**
 * A function that extracts {@link WebManglerEmbed}s from a {@link
 * WebManglerFile}.
 *
 * @since v0.1.21
 */
type EmbedsGetter = (file: WebManglerFile) => Iterable<WebManglerEmbed>;

/**
 * A function that produces a set of {@link MangleExpression}s given the set's
 * options.
 *
 * @since v0.1.14
 * @version v0.1.17
 */
type ExpressionFactory = (options: any) => Iterable<MangleExpression>; // eslint-disable-line @typescript-eslint/no-explicit-any

/**
 * The {@link SimpleLanguagePlugin} abstract class provides an implementation of
 * a {@link WebManglerLanguagePlugin} that works given a set of languages and a
 * map of manglers to {@link MangleExpression}.
 *
 * It is recommended to extend this class - or {@link MultiLanguagePlugin},
 * depending on your needs - if you're implementing a {@link
 * WebManglerLanguagePlugin}.
 *
 * @since v0.1.0
 * @version v0.1.21
 */
abstract class SimpleLanguagePlugin implements WebManglerLanguagePlugin {
  /**
   * The languages, including aliases, that this {@link SimpleLanguagePlugin}
   * supports.
   */
  private readonly languages: Iterable<string>;

  /**
   * A map from {@link MangleExpression}-set names to a functions that produce
   * the respective set of {@link MangleExpression}s given the set's options.
   */
  private readonly expressionFactories: Map<string, ExpressionFactory>;

  /**
   * A collection of functions that can get {@link WebManglerEmbed}s from a
   * supported file.
   */
  private readonly embedsGetters: Iterable<EmbedsGetter>;

  /**
   * Initialize a new {@link SimpleLanguagePlugin}.
   *
   * @example
   * class LanguagePlugin extends SimpleLanguagePlugin {
   *   constructor() {
   *     super(["js", "cjs", "mjs"], expressions);
   *   }
   * }
   * @param languages Supported language, including aliases.
   * @param expressionFactories The {@link ExpressionFactory}s to use.
   * @param [embedsGetters] The {@link EmbedsGetter} to use.
   * @since v0.1.15
   * @version v0.1.21
   */
  constructor(
    languages: Iterable<string>,
    expressionFactories: Map<string, ExpressionFactory>,
    embedsGetters?: Iterable<EmbedsGetter>,
  ) {
    this.embedsGetters = embedsGetters || [];
    this.expressionFactories = expressionFactories;
    this.languages = languages;
  }

  /**
   * @inheritDoc
   * @version v0.1.21
   */
  getEmbeds(file: WebManglerFile): Iterable<WebManglerEmbed> {
    const result: WebManglerEmbed[] = [];
    if (!this.supportsLanguage(file.type)) {
      return result;
    }

    for (const getEmbed of this.embedsGetters) {
      const embeds = getEmbed(file);
      result.push(...embeds);
    }

    return result;
  }

  /**
   * @inheritDoc
   * @version v0.1.17
   */
  getExpressions(
    name: string,
    options: unknown,
  ): ReadonlyMap<string, Iterable<MangleExpression>> {
    const map: Map<string, Iterable<MangleExpression>> = new Map();

    const expressionFactory = this.expressionFactories.get(name);
    if (expressionFactory === undefined) {
      return map;
    }

    const expressions = expressionFactory(options);
    for (const language of this.languages) {
      map.set(language, expressions);
    }

    return map;
  }

  /**
   * Will return all the languages configured when the {@link
   * SimpleLanguagePlugin} was initialized.
   *
   * @inheritDoc
   * @version v0.1.17
   */
  getLanguages(): Iterable<string> {
    return this.languages;
  }

  /**
   * Check if a language is supported by this {@link SimpleLanguagePlugin}.
   *
   * @param query THe language of interest.
   * @returns `true` if the language is supported, `false` otherwise.
   */
  private supportsLanguage(query: string): boolean {
    for (const language of this.languages) {
      if (language === query) {
        return true;
      }
    }

    return false;
  }
}

export default SimpleLanguagePlugin;

export type {
  EmbedsGetter,
  ExpressionFactory,
};
