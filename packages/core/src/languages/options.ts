/**
 * The options for the set of {@link MangleExpression}s that match attributes.
 *
 * NOTE: This set of {@link MangleExpression}s is currently not configurable.
 *
 * @since v0.1.14
 */
type AttributeOptions = null;

/**
 * The options for the set of {@link MangleExpression}s that match the property
 * name of CSS declarations.
 *
 * @since v0.1.14
 */
type CssDeclarationPropertyOptions = {
  /**
   * An optional expression of the prefix required on property names that should
   * be matched.
   *
   * @default `""`
   * @since v0.1.14
   */
  prefix?: string;

  /**
   * An optional expression of the suffix required on property names that should
   * be matched.
   *
   * @default `""`
   * @since v0.1.14
   */
  suffix?: string;
};

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
 * The options for the set of {@link MangleExpression}s that match the values of
 * attributes as a space-separate list of values.
 *
 * @since v0.1.14
 */
type MultiValueAttributeOptions = {
  /**
   * The names of attributes to match.
   *
   * @since v0.1.14
   */
  attributeNames: string[];
};

/**
 * The options for the set of {@link MangleExpression}s that match the CSS query
 * selectors.
 *
 * @since v0.1.14
 */
type QuerySelectorOptions = {
  /**
   * The prefix required on th CSS query selector.
   *
   * Currently allowed are the prefix for classes (`"\\."`) and IDs (`"#"`).
   *
   * @since v0.1.14
   */
  prefix: "\\." | "#";
};

/**
 * The options for the set of {@link MangleExpression}s that match the values of
 * attributes as a single value.
 *
 * @since v0.1.14
 */
type SingleValueAttributeOptions = {
  /**
   * The names of attributes to match.
   *
   * @since v0.1.14
   */
  attributeNames: string[];

  /**
   * An optional expression of the prefix required on values that should be
   * matched.
   *
   * @default `""`
   * @since v0.1.14
   */
  valuePrefix?: string;

  /**
   * An optional expression of the suffix required on values that should be
   * matched.
   *
   * @default `""`
   * @since v0.1.14
   */
  valueSuffix?: string;
};

export type {
  AttributeOptions,
  CssDeclarationPropertyOptions,
  CssDeclarationValueOptions,
  MultiValueAttributeOptions,
  QuerySelectorOptions,
  SingleValueAttributeOptions,
};
