/**
 * Array of characters that are quotes in CSS.
 */
const QUOTES_ARRAY = ["\"", "'"];

/**
 * Regular Expression pattern as a string of ways to combine query selectors in
 * CSS.
 */
const querySelectorCombiners = /(?:[\s+,>~])/.source;

/**
 * Regular Expression pattern as a string of characters that may appear after
 * the end of a query selector in CSS.
 */
const allowedAfterSelector = /(?:$\{querySelectorCombiners\}|[#).:[])/.source
  .replace("$\\{querySelectorCombiners\\}", querySelectorCombiners);

/**
 * Regular Expression pattern as a string of characters that may appear before
 * the start of a query selector in CSS.
 */
const allowedBeforeSelector = /(?:$\{querySelectorCombiners\}|\()/.source
  .replace("$\\{querySelectorCombiners\\}", querySelectorCombiners);

/**
 * Regular Expression pattern as a string of all arithmetic operators in CSS.
 */
const arithmeticOperators = /(?:[*+\-/])/.source;

/**
 * Regular Expression pattern as a string of  all attribute operators in CSS.
 */
const attributeOperators = /(?:=|~=|\|=|\^=|\$=|\*=)/.source;

/**
 * Regular Expression pattern as a string of a comment in CSS.
 */
const comment = /(?:\/\*[^]*?\*\/)/.source;

/**
 * Regular Expression pattern as a string for a double quoted string in CSS.
 */
const doubleQuotedString = /(?:"(?:\\"|[^"])*")/.source;

/**
 * Regular Expression pattern as a string for a single quoted string in CSS.
 */
const singleQuotedString = /(?:'(?:\\'|[^'])*')/.source;

/**
 * Regular Expression pattern as a string for a string in CSS.
 */
const anyString = /(?:$\{doubleQuotedString\}|$\{singleQuotedString\})/.source
  .replace("$\\{doubleQuotedString\\}", doubleQuotedString)
  .replace("$\\{singleQuotedString\\}", singleQuotedString);

/**
 * Regular Expression pattern as a string for quotes in CSS.
 */
const quotes = /(?:["'])/.source;

/**
 * Regular Expression pattern as a string for a CSS ruleset.
 */
const ruleset = /(?:\{(?:$\{anyString\}|[^"'}])*\})/.source
  .replace("$\\{anyString\\}", anyString);

/**
 * An object of common Regular Expression patterns in CSS.
 */
const patterns = {
  allowedAfterSelector,
  allowedBeforeSelector,
  arithmeticOperators,
  attributeOperators,
  anyString,
  comment,
  doubleQuotedString,
  quotes,
  ruleset,
  singleQuotedString,
};

export {
  patterns,
  QUOTES_ARRAY,
};
