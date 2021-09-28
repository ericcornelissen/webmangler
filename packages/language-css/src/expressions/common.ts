/**
 * Regular Expression pattern as a string of ways to combine query selectors in
 * CSS.
 */
const querySelectorCombiners = "(?:\\s|\\,|\\>|\\+|\\~)";

/**
 * Regular Expression pattern as a string of characters that may appear after
 * the end of a query selector in CSS.
 */
const allowedAfterSelector =
  `(?:${querySelectorCombiners}|\\.|\\#|\\[|\\:|\\))`;

/**
 * Regular Expression pattern as a string of characters that may appear before
 * the start of a query selector in CSS.
 */
const allowedBeforeSelector = `(?:${querySelectorCombiners}|\\()`;

/**
 * Regular Expression pattern as a string of all arithmetic operators in CSS.
 */
const arithmeticOperators = "(?:\\+|\\-|\\*|\\/)";

/**
 * Regular Expression pattern as a string of  all attribute operators in CSS.
 */
const attributeOperators = "(?:\\=|\\~=|\\|=|\\^=|\\$=|\\*=)";

/**
 * Regular Expression pattern as a string of a comment opening in CSS.
 */
const commentOpen = "(?:\\/\\*)";

/**
 * Regular Expression pattern as a string of a comment closing in CSS.
 */
const commentClose = "(?:\\*\\/)";

/**
 * Regular Expression pattern as a string of a comment in CSS.
 */
const comment = `(?:${commentOpen}.*?${commentClose})`;

/**
 * Regular Expression pattern as a string for a double quoted string in CSS.
 */
const doubleQuotedString = "(?:\"(?:\\\\\"|[^\"])*\")";

/**
 * Regular Expression pattern as a string for a single quoted string in CSS.
 */
const singleQuotedString = "(?:'(?:\\\\'|[^'])*')";

/**
 * Regular Expression pattern as a string for a string in CSS.
 */
const anyString = `(?:${doubleQuotedString}|${singleQuotedString})`;

/**
 * Regular Expression pattern as a string for quotes in CSS.
 */
const quotes = "(?:\"|')";

/**
 * An object of common Regular Expression patterns in CSS.
 */
export const patterns = {
  allowedAfterSelector,
  allowedBeforeSelector,
  arithmeticOperators,
  attributeOperators,
  anyString,
  comment,
  commentClose,
  commentOpen,
  doubleQuotedString,
  quotes,
  singleQuotedString,
};
