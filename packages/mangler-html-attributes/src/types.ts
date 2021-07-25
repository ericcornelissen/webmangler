/**
 * The options for the set of {@link MangleExpression}s that match attributes.
 *
 * NOTE: This set of {@link MangleExpression}s is currently not configurable.
 *
 * @since v0.1.14
 */
type AttributeOptions = null;

/**
 * The options for the set of {@link MangleExpression}s that match the value of
 * CSS declarations.
 *
 * @since v0.1.14
 */
type CssDeclarationValueOptions = {
  /**
   * An optional expression of the prefix required on values that should be
   * matched.
   *
   * @default `""`
   * @since v0.1.14
   */
  prefix?: string;

  /**
   * An optional expression of the suffix required on values that should be
   * matched.
   *
   * @default `""`
   * @since v0.1.14
   */
  suffix?: string;
};

/**
 * The options for _WebMangler_'s built-in HTML Attributes mangler.
 *
 * @since v0.1.0
 * @version v0.1.23
 */
interface HtmlAttributeManglerOptions {
  /**
   * One or more patterns for HTML attributes that should be mangled.
   *
   * The most common value for this option is: `'data-[a-z-]+'`,  which will
   * mangle all `data-` attributes.
   *
   * @default `"data-[a-z-]+"`
   * @since v0.1.0
   * @version v0.1.17
   */
  attrNamePattern?: string | Iterable<string>;

  /**
   * One or more patterns for HTML attributes that should **never** be mangled.
   *
   * @default `[]`
   * @version v0.1.23
   */
  ignoreAttrNamePattern?: string | Iterable<string>;

  /**
   * A list of strings and patterns of HTML attributes names that should not be
   * used.
   *
   * Patterns are supported since v0.1.7.
   *
   * @default `[]`
   * @since v0.1.0
   * @version v0.1.17
   */
  reservedAttrNames?: Iterable<string>;

  /**
   * A prefix to use for mangled HTML attributes. Set to `''` if no prefix
   * should be used for mangled HTML attributes.
   *
   * The most common value for this option is: `'data-`, which will keep the
   * prefix of 'data-' attributes.
   *
   * @default `"data-"`
   * @since v0.1.0
   */
  keepAttrPrefix?: string;
}

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
  AttributeOptions,
  CssDeclarationValueOptions,
  HtmlAttributeManglerOptions,
  QuerySelectorOptions,
};
