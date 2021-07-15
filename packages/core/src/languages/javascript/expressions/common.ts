/**
 * Regular Expression pattern as a string of ways to combine query selectors in
 * JavaScript.
 */
const querySelectorCombiners = "(?:\\s|\\,|\\>|\\+|\\~)";

/**
 * Regular Expression pattern as a string of characters that may appear after
 * the end of a query selector in JavaScript.
 */
const allowedAfterSelector =
  `(?:${querySelectorCombiners}|\\.|\\#|\\[|\\:|\\))`;

/**
 * Regular Expression pattern as a string of characters that may appear before
 * the start of a query selector in JavaScript.
 */
const allowedBeforeSelector = `(?:${querySelectorCombiners}|\\()`;

/**
 * Array of characters that are quotes in JavaScript.
 */
export const QUOTES_ARRAY: string[] = ["\"", "'", "`"];

/**
 * Regular Expression pattern as a string for an inline comment in JavaScript.
 */
const inlineComment = "(?:\\/\\*[^\\*\\/]*\\*\\/)";

/**
 * Regular Expression pattern as a string for a line comment in JavaScript.
 */
const lineComment = "(?:\\/\\/[^\\r\\n]+\\r?\\n?)";

/**
 * Regular Expression pattern as a string for any comment in JavaScript.
 */
const comment = `(?:${inlineComment}|${lineComment})`;

/**
 * Regular Expression pattern as a string for quotes in JavaScript.
 */
const quotes = "(?:\"|'|`)";

/**
 * An object of common Regular Expression patterns in JavaScript.
 */
export const patterns = {
  allowedAfterSelector,
  allowedBeforeSelector,
  quotes,
  comment,
};
