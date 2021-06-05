
/**
 * Regular Expression pattern as a string of ways to combine query selectors.
 */
const QUERY_SELECTOR_COMBINERS = "\\s|\\,|\\>|\\+|\\~";

/**
 * Regular Expression pattern as a string of all characters that may appear
 * after the end of a query selector.
 */
export const QUERY_SELECTOR_ALLOWED_AFTER =
  `${QUERY_SELECTOR_COMBINERS}|\\.|\\#|\\[|\\:|\\)`;

/**
 * Regular Expression pattern as a string of all characters that may appear
 * before the start of a query selector.
 */
export const QUERY_SELECTOR_ALLOWED_BEFORE = `${QUERY_SELECTOR_COMBINERS}|\\(`;
