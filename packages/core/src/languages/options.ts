/**
 * The options for the set of {@link MangleExpression}s that match attributes.
 *
 * NOTE: This set of {@link MangleExpression}s is currently not configurable.
 *
 * @since v0.1.14
 */
type AttributeOptions = null;

/**
 * The options for the set of {@link MangleExpression}s that match the values of
 * attributes as a space-separate list of values.
 *
 * @since v0.1.14
 */
type MultiValueAttributesOptions = {
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
type QuerySelectorsOptions = {
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
type SingleValueAttributesOptions = {
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
  MultiValueAttributesOptions,
  QuerySelectorsOptions,
  SingleValueAttributesOptions,
};