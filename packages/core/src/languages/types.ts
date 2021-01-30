/**
 * The interface that every language plugin for _WebMangler_ must implement.
 *
 * @since v0.1.0
 */
interface WebManglerLanguagePlugin {
  /**
   * Get {@link ManglerExpression}s for one or more languages for a {@link
   * WebManglerPlugin}.
   *
   * If the {@link WebManglerLanguagePlugin} supports multiple languages it may
   * return a {@link ManglerExpressions} instance for each language.
   *
   * If the {@link WebManglerLanguagePlugin} does not provide support for the
   * {@link WebManglerPlugin} it should return zero {@link ManglerExpression}s.
   *
   * @param pluginId The identifier of the {@link WebManglerPlugin}.
   * @returns The {@link ManglerExpression}s for the plugin for the language(s).
   * @since v0.1.0
   */
  getExpressionsFor(pluginId: string): ManglerExpressions[];
}

/**
 * Interface representing a regular expression-like object that can be used to
 * find and replace patterns by _WebMangler_.
 *
 * @since v0.1.0
 */
interface ManglerExpression {
  /**
   * Execute the {@link ManglerExpression} on a string for a given pattern.
   *
   * @param s The string to execute the expression on.
   * @param pattern The pattern to execute the expression with.
   * @returns The matched substrings in `s`.
   * @since v0.1.0
   */
  exec(s: string, pattern: string): Iterable<string>;

  /**
   * Replace patterns in a string by other strings.
   *
   * @param s The string to replace in.
   * @param original The string/pattern to replace.
   * @param replacement The string/pattern to replace `original` by.
   * @returns The string with the patterns replaced.
   * @since v0.1.0
   */
  replace(s: string, original: string, replacement: string): string;
}

/**
 * Interface wrapping one ore more {@link ManglerExpression}s for a specific
 * language.
 *
 * @since v0.1.0
 */
interface ManglerExpressions {
  /**
   * The language for which the `expressions` are.
   *
   * @since v0.1.0
   */
  language: string;

  /**
   * The {@link ManglerExpression}s for the `language`.
   *
   * @since v0.1.0
   */
  expressions: ManglerExpression[];
}

/**
 * Interface representing a match found by a {@link ManglerExpression}.
 *
 * @since v0.1.0
 */
interface ManglerMatch {
  /**
   * Get the full string that was matched.
   *
   * @returns The full string that was matched.
   * @since v0.1.0
   */
  getMatchedStr(): string;

  /**
   * Get the value of a captured group
   *
   * @param index The index of the captured group (starting at 0).
   * @returns The value of group `index`, or `""` if no such group exists.
   * @since v0.1.0
   */
  getGroup(index: number): string;

  /**
   * Get the value of a captured group
   *
   * @param name The name of the captured group.
   * @returns The value of group `name`, or `""` if no such group exists.
   * @since v0.1.0
   */
  getNamedGroup(name: string): string;
}

export type {
  ManglerExpression,
  ManglerExpressions,
  ManglerMatch,
  WebManglerLanguagePlugin,
};
