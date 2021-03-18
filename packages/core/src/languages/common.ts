/**
 * Regular Expression pattern as a string required before a CSS attribute
 * selector.
 *
 * @since v0.1.16
 */
export const ATTRIBUTE_SELECTOR_PRE = "\\[\\s*";

/**
 * Regular Expression pattern as a string required after a CSS attribute
 * selector.
 *
 * @since v0.1.16
 */
export const ATTRIBUTE_SELECTOR_POST = "\\s*(?:\\]|\\=|\\~=|\\|=|\\^=|\\$=|\\*=)";

/**
 * Regular Expression pattern as a string required before attribute value usage
 * in CSS.
 *
 * @since v0.1.16
 */
export const ATTRIBUTE_USAGE_PRE = "attr\\s*\\(\\s*";

/**
 * Regular Expression pattern as a string required after attribute value usage
 * in CSS.
 *
 * @since v0.1.16
 */
export const ATTRIBUTE_USAGE_POST = "(\\s+([a-zA-Z]+|%))?\\s * (,|\\))";
