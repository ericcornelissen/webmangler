import type { MangleExpression, WebManglerLanguagePlugin } from "../../types";

/**
 * A function that produces a set of {@link MangleExpression}s given the set's
 * options.
 *
 * @since v0.1.14
 */
export type ExpressionFactory = (options: any) => MangleExpression[]; // eslint-disable-line @typescript-eslint/no-explicit-any

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
 * @version v0.1.17
 */
export default abstract class SimpleLanguagePlugin
    implements WebManglerLanguagePlugin {
  /**
   * The languages, including aliases, that this {@link SimpleLanguagePlugin}
   * supports.
   */
  private readonly languages: string[];

  /**
   * A map from {@link MangleExpression}-set names to a functions that produce
   * the respective set of {@link MangleExpression}s given the set's options.
   */
  private readonly expressionFactories: Map<string, ExpressionFactory>;

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
   * @param expressionFactories The {@link ExpressionFactory}s to use.
   * @since v0.1.15
   * @version v0.1.15
   */
  constructor(
    languages: string[],
    expressionFactories: Map<string, ExpressionFactory>,
  ) {
    this.languages = languages;
    this.expressionFactories = expressionFactories;
  }

  /**
   * @inheritDoc
   */
  getExpressions(
    name: string,
    options: unknown,
  ): Map<string, MangleExpression[]> {
    const map: Map<string, MangleExpression[]> = new Map();

    const expressionFactory = this.expressionFactories.get(name);
    if (expressionFactory === undefined) {
      return map;
    }

    const expressions = expressionFactory(options);
    return this.languages.reduce((m, lang) => m.set(lang, expressions), map);
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
