import {
  QUERY_SELECTOR_ALLOWED_AFTER,
  QUERY_SELECTOR_ALLOWED_BEFORE,
} from "../../common";

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
const comment = `(?:${commentOpen}[^\\*\\/]*${commentClose})`;

/**
 * Regular Expression pattern as a string of a declaration block in CSS.
 */
const declarationBlock = "(?:\\{[^\\}]*\\})";

/**
 * Regular Expression pattern as a string for a double quoted string in CSS.
 */
const doubleQuotedString = "(?:\"[^\"]*\")";

/**
 * Regular Expression pattern as a string for a single quoted string in CSS.
 */
const singleQuotedString = "(?:'[^']*')";

/**
 * Regular Expression pattern as a string for a string in CSS.
 */
const anyString = `(?:${doubleQuotedString}|${singleQuotedString})`;

/**
 * Regular Expression pattern as a string for quotes in CSS.
 */
const quotes = "(?:\"|')";

/**
 * An object of common Regular Expression patterns in CSS
 */
export const patterns = {
  arithmeticOperators,
  attributeOperators,
  anyString,
  comment,
  commentClose,
  commentOpen,
  declarationBlock,
  doubleQuotedString,
  quotes,
  singleQuotedString,
  validBeforeQuery: QUERY_SELECTOR_ALLOWED_BEFORE,
  validAfterQuery: QUERY_SELECTOR_ALLOWED_AFTER,
};
