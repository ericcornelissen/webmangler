/**
 * The options for _WebMangler_'s built-in CSS variables mangler.
 *
 * @since v0.1.0
 * @version v0.1.23
 */
interface CssVariableManglerOptions {
  /**
   * One or more patterns for CSS variables that should be mangled.
   *
   * @default `"[a-zA-Z-]+"`
   * @since v0.1.0
   * @version v0.1.17
   */
  cssVarNamePattern?: string | Iterable<string>;

  /**
   * One or more patterns for CSS variables that should **never** be mangled.
   *
   * @default `[]`
   * @version v0.1.23
   */
  ignoreCssVarNamePattern?: string | Iterable<string>;

  /**
   * A list of strings and patterns of CSS variable names that should not be
   * used.
   *
   * Patterns are supported since v0.1.7.
   *
   * @default `[]`
   * @since v0.1.0
   * @version v0.1.17
   */
  reservedCssVarNames?: Iterable<string>;

  /**
   * A prefix to use for mangled CSS variables.
   *
   * @default `""`
   * @since v0.1.0
   */
  keepCssVarPrefix?: string;
}

export type {
  CssVariableManglerOptions,
};
