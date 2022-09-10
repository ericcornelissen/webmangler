/**
 * Get a Regular Expression pattern as a string for certain attributes with
 * quoted values in HTML.
 *
 * @param attributesPattern The pattern of the attributes to match.
 * @param quotePattern The pattern of the quote(s) to match.
 * @returns A Regular Expression pattern as a string.
 */
const QUOTED_ATTRIBUTE_PATTERN = (
  attributesPattern: string,
  quotePattern: string,
): string => `(?:${attributesPattern})\\s*=\\s*${quotePattern}\\s*`;

/**
 * Array of characters that are quotes in HTML.
 */
const QUOTES_ARRAY: string[] = ["\"", "'"];

/**
 * Regular Expression pattern as a string for a double quoted string in HTML.
 */
const doubleQuotedString = /(?:"[^"]*")/.source;

/**
 * Regular Expression pattern as a string for a single quoted string in HTML.
 */
const singleQuotedString = /(?:'[^']*')/.source;

/**
 * Regular Expression pattern as a string for a string in HTML.
 */
const anyString = /(?:${doubleQuotedString}|${singleQuotedString})/.source
  .replace("${doubleQuotedString}", doubleQuotedString)
  .replace("${singleQuotedString}", singleQuotedString);

/**
 * Regular Expression pattern as a string for valid characters after an
 * attribute in HTML.
 */
const afterAttribute = /(?:\s|\/|>)/.source;

/**
 * Regular Expression pattern as a string for valid characters after an
 * attribute name in HTML.
 */
const afterAttributeName = /(?:=|${afterAttribute})/.source
  .replace("${afterAttribute}", afterAttribute);

/**
 * Regular Expression pattern as a string for any number of attributes in HTML.
 */
const attributes = /(?:[^>\s=]+(?:\s*=\s*(?:${anyString}|[^>\s"']*))?\s+)+/.source
  .replace("${anyString}", anyString);

/**
 * Regular Expression pattern as a string of a comment in HTML.
 */
const comment = /(?:<!--[^]*?--!?>)/.source;

/**
 * Regular Expression pattern as a string for quotes in HTML.
 */
const quotes = /(?:"|')/.source;

/**
 * Regular Expression pattern as a string for a tag opening in HTML.
 */
const tagOpen = /(?:<\s*[a-zA-Z0-9]+\s+)/.source;

/**
 * An object of common Regular Expression patterns in HTML.
 */
const patterns = {
  afterAttribute,
  afterAttributeName,
  anyString,
  attributes,
  comment,
  quotes,
  tagOpen,
};

export {
  patterns,
  QUOTES_ARRAY,
  QUOTED_ATTRIBUTE_PATTERN,
};
