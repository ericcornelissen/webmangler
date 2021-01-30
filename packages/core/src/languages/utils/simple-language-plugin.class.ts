import type {
  ManglerExpression,
  ManglerExpressions,
  WebManglerLanguagePlugin,
} from "../types";

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
   * The language, and its aliases, that this {@link SimpleLanguagePlugin}
   * supports.
   */
  private readonly languageAliases: string[];

  /**
   * The {@link ManglerExpression}s for each supported {@link WebManglerPlugin}.
   */
  private readonly expressions: Map<string, ManglerExpression[]>;

  /**
   * Initialize a new {@link SimpleLanguagePlugin}.
   *
   * @param languageAliases A language and its aliases.
   * @param expressions The expressions for supported {@link WebManglerPlugin}.
   * @since v0.1.0
   */
  constructor(
    languageAliases: string[],
    expressions: Map<string, ManglerExpression[]>,
  ) {
    this.languageAliases = languageAliases;
    this.expressions = expressions;
  }

  /**
   * Will return all the {@link ManglerExpressions} for the mangler configured
   * when the {@link SimpleLanguagePlugin} was initialized.
   *
   * @inheritDoc
   * @since v0.1.0
   */
  getExpressionsFor(manglerId: string): ManglerExpressions[] {
    const manglerMatchers = this.expressions.get(manglerId) || [];
    return this.languageAliases.map((language: string): ManglerExpressions => ({
      language: language,
      expressions: manglerMatchers,
    }));
  }
}
