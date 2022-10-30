/**
 * The {@link MangleExpression} options for HTML attributes.
 *
 * NOTE: This is currently not configurable.
 *
 * @since v0.1.14
 * @version v0.1.24
 */
type AttributeOptions = Record<string, never>;

/**
 * The {@link MangleExpression} options for CSS properties.
 *
 * @since v0.1.14
 * @version v0.1.26
 */
interface CssDeclarationPropertyOptions {
  /**
   * A regular expression as a string defining the prefix that properties must
   * have to be considered a match.
   *
   * @default `""`
   * @since v0.1.14
   * @version v0.1.26
   */
  readonly prefix?: string;

  /**
   * A regular expression as a string defining the suffix that properties must
   * have to be considered a match.
   *
   * @default `""`
   * @since v0.1.14
   * @version v0.1.26
   */
  readonly suffix?: string;
}

/**
 * The {@link MangleExpression} options for CSS property values.
 *
 * @since v0.1.14
 * @version v0.1.27
 */
interface CssDeclarationValueOptions {
  /**
   * The name of the kind of CSS value.
   *
   * @since v0.1.27
   */
  readonly kind: "function" | "value" | "variable";

  /**
   * A regular expression as a string defining the prefix that property values
   * must have to be considered a match.
   *
   * @default `""`
   * @since v0.1.14
   * @version v0.1.26
   * @deprecated
   */
  readonly prefix?: string;

  /**
   * A regular expression as a string defining the suffix that property values
   * must have to be considered a match.
   *
   * @default `""`
   * @since v0.1.14
   * @version v0.1.26
   * @deprecated
   */
  readonly suffix?: string;
}

/**
 * The {@link MangleExpression} options for attribute values that consist of
 * multiple values.
 *
 * @since v0.1.14
 * @version v0.1.26
 */
interface MultiValueAttributeOptions {
  /**
   * The names of the attributes to match values of.
   *
   * @since v0.1.14
   * @version v0.1.26
   */
  readonly attributeNames: Iterable<string>;
}

/**
 * The {@link MangleExpression} options for CSS query selectors.
 *
 * @since v0.1.14
 * @version v0.1.27
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
   * @version v0.1.26
   * @deprecated
   */
  readonly prefix?: string;

  /**
   * A regular expression as a string defining the suffix that query selectors
   * must have to be considered a match.
   *
   * NOTE: it is recommended to only ever use one of `""` and `"\\]"`.
   *
   * @default `""`
   * @since v0.1.14
   * @version v0.1.26
   * @deprecated
   */
  readonly suffix?: string;

  /**
   * The name of the kind of query selector.
   *
   * @since v0.1.27
   */
  readonly kind: "element" | "attribute" | "class" | "id";
}

/**
 * The {@link MangleExpression} options for attribute values consisting of a
 * single value.
 *
 * @since v0.1.14
 * @version v0.1.26
 */
interface SingleValueAttributeOptions {
  /**
   * The names of the attributes to match values of.
   *
   * @since v0.1.14
   * @version v0.1.26
   */
  readonly attributeNames: Iterable<string>;

  /**
   * A regular expression as a string defining the prefix that values must have
   * to be considered a match.
   *
   * @default `""`
   * @since v0.1.14
   * @version v0.1.26
   */
  readonly valuePrefix?: string;

  /**
   * A regular expression as a string defining the suffix that values must have
   * to be considered a match.
   *
   * @default `""`
   * @since v0.1.14
   * @version v0.1.26
   */
  readonly valueSuffix?: string;
}

export type {
  AttributeOptions,
  CssDeclarationPropertyOptions,
  CssDeclarationValueOptions,
  MultiValueAttributeOptions,
  QuerySelectorOptions,
  SingleValueAttributeOptions,
};
