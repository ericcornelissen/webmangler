/**
 * The options for _WebMangler_'s built-in CSS class mangler.
 *
 * @since v0.1.0
 * @version v0.1.23
 */
interface CssClassManglerOptions {
  /**
   * One or more patterns for CSS classes that should be mangled.
   *
   * @default `"cls-[a-zA-Z-_]+"`
   * @since v0.1.0
   * @version v0.1.17
   */
  classNamePattern?: string | Iterable<string>;

  /**
   * One or more patterns for CSS classes that should **never** be mangled.
   *
   * @default `[]`
   * @version v0.1.23
   */
  ignoreClassNamePattern?: string | Iterable<string>;

  /**
   * A list of strings and patterns of CSS class names that should not be used.
   *
   * Patterns are supported since v0.1.7.
   *
   * @default `[]`
   * @since v0.1.0
   * @version v0.1.17
   */
  reservedClassNames?: Iterable<string>;

  /**
   * A prefix to use for mangled CSS classes.
   *
   * @default `""`
   * @since v0.1.0
   */
  keepClassNamePrefix?: string;

  /**
   * A list of HTML attributes whose value to treat as `class`.
   *
   * NOTE: the `class` attribute is always included and does not need to be
   * specified when using this option.
   *
   * @default `[]`
   * @since v0.1.16
   * @version v0.1.17
   */
  classAttributes?: Iterable<string>;
}

export type {
  CssClassManglerOptions,
};
