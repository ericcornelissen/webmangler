/**
 * Get a Regular Expression pattern as a string for certain attributes with
 * quoted values in HTML.
 *
 * @param attributesPattern The pattern of the attributes to match.
 * @param quotePattern The pattern of the quote(s) to match.
 * @returns A Regular Expression pattern as a string.
 */
export const QUOTED_ATTRIBUTE_PATTERN = (
  attributesPattern: string,
  quotePattern: string,
): string => `\\s(?:${attributesPattern})\\s*=\\s*${quotePattern}\\s*`;

/**
 * Array of characters that are quotes in HTML.
 */
export const QUOTES_ARRAY = ["\"", "'"];

/**
 * Regular Expression pattern as a string for quotes in HTML.
 */
export const QUOTES_PATTERN = "\"|'";
