/**
 * Array of characters that are quotes in JavaScript.
 */
const QUOTES_ARRAY: string[] = ["\"", "'", "`"];

/**
 * Regular Expression pattern as a string of ways to combine query selectors in
 * JavaScript.
 */
const querySelectorCombiners = /(?:[\s+,>~])/.source;

/**
 * Regular Expression pattern as a string of characters that may appear after
 * the end of a query selector in JavaScript.
 */
const allowedAfterSelector = /(?:$\{querySelectorCombiners\}|[#).:[])/.source
  .replace("$\\{querySelectorCombiners\\}", querySelectorCombiners);

/**
 * Regular Expression pattern as a string of characters that may appear before
 * the start of a query selector in JavaScript.
 */
const allowedBeforeSelector = /(?:$\{querySelectorCombiners\}|\()/.source
  .replace("$\\{querySelectorCombiners\\}", querySelectorCombiners);

/**
 * Regular Expression pattern as a string for an inline comment in JavaScript.
 */
const inlineComment = /(?:\/\*[^]*?\*\/)/.source;

/**
 * Regular Expression pattern as a string for a line comment in JavaScript.
 */
const lineComment = /(?:\/\/[^\n\r]*\r?\n?)/.source;

/**
 * Regular Expression pattern as a string for any comment in JavaScript.
 */
const comment = /(?:$\{inlineComment\}|$\{lineComment\})/.source
  .replace("$\\{inlineComment\\}", inlineComment)
  .replace("$\\{lineComment\\}", lineComment);

/**
 * Regular Expression pattern as a string for quotes in JavaScript.
 */
const quotes = /(?:["'`])/.source;

/**
 * An object of common Regular Expression patterns in JavaScript.
 */
const patterns = {
  allowedAfterSelector,
  allowedBeforeSelector,
  quotes,
  comment,
};

export {
  patterns,
  QUOTES_ARRAY,
};
