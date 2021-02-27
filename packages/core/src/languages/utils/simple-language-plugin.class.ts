import type { MangleExpression, WebManglerLanguagePlugin } from "../../types";

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
 * @version v0.1.14
 */
export default abstract class SimpleLanguagePlugin
    implements WebManglerLanguagePlugin {
  /**
   * The languages, including aliases, that this {@link SimpleLanguagePlugin}
   * supports.
   */
  private readonly languages: string[];

  /**
   * The {@link MangleExpression}s for each supported {@link WebManglerPlugin}.
   */
  private readonly expressions: Map<string, MangleExpression[]>;

  /**
   * TODO
   */
  private readonly tmp: Map<string, (options: unknown) => MangleExpression[]>;

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
   * @param expressions2 TODO.
   * @since v0.1.0
   * @version v0.1.14
   * @deprecated
   */
  constructor(
    languages: string[],
    expressions: Map<string, MangleExpression[]>,
    expressions2: Map<string, (options: unknown) => MangleExpression[]>,
  ) {
    this.languages = languages;
    this.expressions = expressions;
    this.tmp = expressions2;
  }

  /**
   * @inheritDoc
   */
  getExpressionsFor(name: string, options: unknown): MangleExpression[] {
    const fn = this.tmp.get(name);
    if (fn === undefined) {
      return [];
    }

    return fn(options);
  }

  /**
   * @inheritdoc
   * @deprecated
   */
  getExpressions(manglerId: string): Map<string, MangleExpression[]> {
    const manglerExpressions = this.expressions.get(manglerId) || [];

    const result: Map<string, MangleExpression[]> = new Map();
    this.languages.forEach((language) => {
      result.set(language, manglerExpressions);
    });

    return result;
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
