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
 * @version v0.1.28
 */
type EmbedsGetter = (
  file: Readonly<WebManglerFile>,
) => Iterable<WebManglerEmbed>;

/**
 * A function that produces a set of {@link MangleExpression}s given the set's
 * options.
 *
 * @since v0.1.14
 * @version v0.1.17
 */
type ExpressionFactory = (options: any) => Iterable<MangleExpression>; // eslint-disable-line @typescript-eslint/no-explicit-any

/**
 * The configuration options of a {@link SimpleLanguagePlugin}.
 *
 * @since v0.1.27
 * @version v0.1.28
 */
interface SimpleLanguagePluginOptions {
  /**
   * The {@link EmbedsGetter}s to use.
   *
   * @since v0.1.21
   * @version v0.1.27
   */
  readonly embedsGetters?: Iterable<EmbedsGetter>;

  /**
   * The {@link ExpressionFactory}s to use.
   *
   * @since v0.1.14
   * @version v0.1.28
   */
  readonly expressionFactories: ReadonlyMap<string, ExpressionFactory>;

  /**
   * Supported languages, including aliases.
   *
   * @since v0.1.10
   * @version v0.1.27
   */
  readonly languages: Iterable<string>;
}

/**
 * The {@link SimpleLanguagePlugin} abstract class provides an implementation of
 * a {@link WebManglerLanguagePlugin} that works given a set of languages and a
 * map of manglers to {@link MangleExpression}.
 *
 * It is recommended to extend this class - or {@link MultiLanguagePlugin},
 * depending on your needs - if you're implementing a
 * {@link WebManglerLanguagePlugin}.
 *
 * @since v0.1.0
 * @version v0.1.28
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
  private readonly expressionFactories: ReadonlyMap<string, ExpressionFactory>;

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
   *     super({
   *       expressionFactories,
   *       languages,
   *     });
   *   }
   * }
   * @param params The {@link SimpleLanguagePluginOptions}.
   * @since v0.1.15
   * @version v0.1.28
   */
  constructor(
    params: SimpleLanguagePluginOptions,
  ) {
    this.embedsGetters = params.embedsGetters || [];
    this.expressionFactories = params.expressionFactories;
    this.languages = params.languages;
  }

  /**
   * @inheritDoc
   * @version v0.1.21
   * @version v0.1.28
   */
  getEmbeds(
    file: Readonly<WebManglerFile>,
  ): Iterable<WebManglerEmbed> {
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
   * @version v0.1.26
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
  SimpleLanguagePluginOptions,
};
