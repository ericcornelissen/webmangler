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

/**
 * The options for the set of {@link MangleExpression}s that match the values of
 * attributes as a space-separate list of values.
 *
 * @since v0.1.14
 * @version v0.1.17
 */
type MultiValueAttributeOptions = {
  /**
   * The names of attributes to match.
   *
   * @since v0.1.14
   * @version v0.1.17
   */
  attributeNames: Iterable<string>;
};

/**
 * The options for the set of {@link MangleExpression}s that match CSS query
 * selectors.
 *
 * @since v0.1.14
 */
type QuerySelectorOptions = {
  /**
   * The prefix required on the CSS query selector.
   *
   * NOTE: it is recommended to only ever use one of `"\\."`, `"#"`, and
   * `"\\["`.
   *
   * @default `""`
   * @since v0.1.14
   */
  prefix?: string;

  /**
   * The suffix required on the CSS query selector.
   *
   * NOTE: it is recommended to only ever use one of `""` and `"\\."`.
   *
   * @default `""`
   * @since v0.1.14
   */
  suffix?: string;
};

export type {
  CssClassManglerOptions,
  MultiValueAttributeOptions,
  QuerySelectorOptions,
};
