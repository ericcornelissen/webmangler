/**
 * The {@link MangleExpression} options for HTML attributes.
 *
 * NOTE: This is currently not configurable.
 *
 * @since v0.1.14
 */
type AttributeOptions = null;

/**
 * The {@link MangleExpression} options for CSS properties.
 *
 * @since v0.1.14
 */
interface CssDeclarationPropertyOptions {
  /**
   * A regular expression as a string defining the prefix that properties must
   * have to be considered a match.
   *
   * @default `""`
   * @since v0.1.14
   */
  prefix?: string;

  /**
   * A regular expression as a string defining the suffix that properties must
   * have to be considered a match.
   *
   * @default `""`
   * @since v0.1.14
   */
  suffix?: string;
}

/**
 * The {@link MangleExpression} options for CSS property values.
 *
 * @since v0.1.14
 */
interface CssDeclarationValueOptions {
  /**
   * A regular expression as a string defining the prefix that property values
   * must have to be considered a match.
   *
   * @default `""`
   * @since v0.1.14
   */
  prefix?: string;

  /**
   * A regular expression as a string defining the suffix that property values
   * must have to be considered a match.
   *
   * @default `""`
   * @since v0.1.14
   */
  suffix?: string;
}

/**
 * The {@link MangleExpression} options for attribute values that consist of
 * multiple values.
 *
 * @since v0.1.14
 * @version v0.1.17
 */
interface MultiValueAttributeOptions {
  /**
   * The names of the attributes to match values of.
   *
   * @since v0.1.14
   * @version v0.1.17
   */
  attributeNames: Iterable<string>;
}

/**
 * The {@link MangleExpression} options for CSS query selectors.
 *
 * @since v0.1.14
 */
interface QuerySelectorOptions {
  /**
   * A regular expression as a string defining the prefix that query selectors
   * must have to be considered a match.
   *
   * NOTE: it is recommended to only ever use one of `"\\."`, `"#"`, and
   * `"\\["`.
   *
   * @default `""`
   * @since v0.1.14
   */
  prefix?: string;

  /**
   * A regular expression as a string defining the suffix that query selectors
   * must have to be considered a match.
   *
   * NOTE: it is recommended to only ever use one of `""` and `"\\]"`.
   *
   * @default `""`
   * @since v0.1.14
   */
  suffix?: string;
}

/**
 * The {@link MangleExpression} options for attribute values consisting of a
 * single value.
 *
 * @since v0.1.14
 * @version v0.1.17
 */
interface SingleValueAttributeOptions {
  /**
   * The names of the attributes to match values of.
   *
   * @since v0.1.14
   * @version v0.1.17
   */
  attributeNames: Iterable<string>;

  /**
   * A regular expression as a string defining the prefix that values must have
   * to be considered a match.
   *
   * @default `""`
   * @since v0.1.14
   */
  valuePrefix?: string;

  /**
   * A regular expression as a string defining the suffix that values must have
   * to be considered a match.
   *
   * @default `""`
   * @since v0.1.14
   */
  valueSuffix?: string;
}

export type {
  AttributeOptions,
  CssDeclarationPropertyOptions,
  CssDeclarationValueOptions,
  MultiValueAttributeOptions,
  QuerySelectorOptions,
  SingleValueAttributeOptions,
};
