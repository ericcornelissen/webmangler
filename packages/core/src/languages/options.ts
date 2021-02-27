/**
 * TODO.
 *
 * @since v0.1.14
 */
type AttributeOptions = null;

/**
 * TODO.
 *
 * @since v0.1.14
 */
type MultiValueAttributesOptions = {
  /**
   * TODO.
   *
   * @since v0.1.14
   */
  attributeNames: string[];
};

/**
 * TODO.
 *
 * @since v0.1.14
 */
type QuerySelectorsOptions = {
  /**
   * TODO.
   *
   * @since v0.1.14
   */
  prefix: "\\." | "#";
};

/**
 * TODO.
 *
 * @since v0.1.14
 */
type SingleValueAttributesOptions = {
  /**
   * TODO.
   *
   * @since v0.1.14
   */
  attributeNames: string[];

  /**
   * TODO.
   *
   * @default `""`
   * @since v0.1.14
   */
  valuePrefix?: string;

  /**
   * TODO.
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
