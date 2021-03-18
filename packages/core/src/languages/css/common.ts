/**
 * Regular Expression pattern as a string for sections of CSS outside a block
 * and outside a string.
 */
export const NOT_IN_A_BLOCK_OR_STRING = "(?<!\"[^\"}]*|'[^'}]*)";

/**
 * Regular Expression pattern as a string for sections of CSS inside a block but
 * outside a string.
 */
export const IN_A_BLOCK_NOT_A_STRING = "(?<!\"[^\";]*|'[^';]*)";

/**
 * Regular Expression pattern as a string for quotes in CSS.
 */
export const QUOTES_PATTERN = "\"|'";
