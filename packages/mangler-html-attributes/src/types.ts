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

export type {
  HtmlAttributeManglerOptions,
};
