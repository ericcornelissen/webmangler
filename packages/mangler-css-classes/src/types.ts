/**
 * The options for _WebMangler_'s built-in CSS class mangler.
 *
 * @since v0.1.0
 * @version v0.1.24
 */
interface CssClassManglerOptions {
  /**
   * One or more patterns for CSS classes that should be mangled.
   *
   * @default "cls-[a-zA-Z-_]+"
   * @since v0.1.0
   * @version v0.1.24
   */
  readonly classNamePattern?: string | Iterable<string>;

  /**
   * One or more patterns for CSS classes that should **never** be mangled.
   *
   * @default []
   * @since v0.1.23
   * @version v0.1.24
   */
  readonly ignoreClassNamePattern?: string | Iterable<string>;

  /**
   * A list of strings and patterns of CSS class names that should not be used.
   *
   * Patterns are supported since v0.1.7.
   *
   * @default []
   * @since v0.1.0
   * @version v0.1.24
   */
  readonly reservedClassNames?: Iterable<string>;

  /**
   * A prefix to use for mangled CSS classes.
   *
   * @default ""
   * @since v0.1.0
   * @version v0.1.24
   */
  readonly keepClassNamePrefix?: string;

  /**
   * A list of HTML attributes whose value to treat as `class`.
   *
   * NOTE: the `class` attribute is always included and does not need to be
   * specified when using this option.
   *
   * @default ["class"]
   * @since v0.1.16
   * @version v0.1.24
   */
  readonly classAttributes?: Iterable<string>;
}

export type {
  CssClassManglerOptions,
};
