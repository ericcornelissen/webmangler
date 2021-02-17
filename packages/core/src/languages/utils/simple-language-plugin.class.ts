import type {
  ManglerExpression,
  ManglerExpressions,
  WebManglerLanguagePlugin,
} from "../../types";

/**
 * The {@link SimpleLanguagePlugin} abstract class provides an implementation of
 * a {@link WebManglerLanguagePlugin} that works given a set of languages and a
 * map of manglers to {@link ManglerExpression}.
 *
 * It is recommended to extend this class - or {@link MultiLanguagePlugin},
 * depending on your needs - if you're implementing a {@link
 * WebManglerLanguagePlugin}.
 *
 * @since v0.1.0
 */
export default abstract class SimpleLanguagePlugin
    implements WebManglerLanguagePlugin {
  /**
   * The languages, including aliases, that this {@link SimpleLanguagePlugin}
   * supports.
   */
  private readonly languages: string[];

  /**
   * The {@link ManglerExpression}s for each supported {@link WebManglerPlugin}.
   */
  private readonly expressions: Map<string, ManglerExpression[]>;

  /**
   * Initialize a new {@link SimpleLanguagePlugin}.
   *
   * @example
   * class LanguagePlugin extends SimpleLanguagePlugin {
   *   constructor() {
   *     super(["js", "cjs", "mjs"], expressions);
   *   }
   * }
   *
   * @param languages Supported language, including aliases.
   * @param expressions The expressions for supported {@link WebManglerPlugin}.
   * @since v0.1.0
   */
  constructor(
    languages: string[],
    expressions: Map<string, ManglerExpression[]>,
  ) {
    this.languages = languages;
    this.expressions = expressions;
  }

  /**
   * Will return all the {@link ManglerExpressions} for the mangler configured
   * when the {@link SimpleLanguagePlugin} was initialized.
   *
   * @inheritDoc
   */
  getExpressionsFor(manglerId: string): ManglerExpressions[] {
    const manglerMatchers = this.expressions.get(manglerId) || [];
    return this.languages.map((language: string): ManglerExpressions => ({
      language: language,
      expressions: manglerMatchers,
    }));
  }

  /**
   * Will return all the languages configured when the {@link
   * SimpleLanguagePlugin} was initialized.
   *
   * @inheritDoc
   */
  getLanguages(): string[] {
    return this.languages;
  }
}
