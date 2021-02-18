import type {
  MangleEngineOptions,
  ManglerExpression,
  ManglerExpressions,
  WebManglerPlugin,
  WebManglerLanguagePlugin,
} from "../../types";

/**
 * The {@link BaseManglerPlugin} abstract class provides a basic implementation
 * of a {@link WebManglerPlugin} that deals with the handling of {@link
 * WebManglerLanguagePlugin}.
 *
 * It is recommended to extend this class - or {@link SimpleManglerPlugin} or
 * {@link MultiMangler}, depending on your needs - if you're implementing a
 * {@link WebManglerPlugin}.
 *
 * @since v0.1.0
 * @version v0.1.11
 */
export default abstract class BaseManglerPlugin implements WebManglerPlugin {
  /**
   * The identifier of the {@link WebManglerPlugin}.
   */
  private readonly id: string;

  /**
   * The {@link ManglerExpression}s for each language that belong to this
   * {@link WebManglerPlugin}.
   */
  readonly expressions: Map<string, ManglerExpression[]> = new Map();

  /**
   * Initialize a new {@link WebManglerPlugin}.
   *
   * @param id The identifier for the {@link WebManglerPlugin}.
   * @since v0.1.0
   */
  constructor(id: string) {
    this.id = id;
  }

  /**
   * Automatically loads {@link WebManglerLanguagePlugin}s into the {@link
   * WebManglerPlugin} for you.
   *
   * @param languagePlugin The {@link WebManglerLanguagePlugin} to be used.
   * @since v0.1.0
   */
  use(languagePlugin: WebManglerLanguagePlugin): void {
    const languageMatchers = languagePlugin.getExpressionsFor(this.id);
    languageMatchers.forEach((value: ManglerExpressions) => {
      const { language, expressions } = value;
      this.expressions.set(language, expressions);
    });
  }

  /**
   * @inheritDoc
   */
  abstract config(): MangleEngineOptions | MangleEngineOptions[];
}

