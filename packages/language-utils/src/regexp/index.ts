import * as rewriters from "./rewriters";

/**
 * Convert a regular expression pattern as a string into a case insensitive
 * variant of the same regular expression pattern.
 *
 * @param pattern The pattern to make case insensitive.
 * @returns A case insensitive variant of the pattern.
 */
function toCaseInsensitivePattern(pattern: string): string {
  return Object
    .values(rewriters)
    .reduce((acc, rewriter) => rewriter(acc), pattern);
}

export {
  toCaseInsensitivePattern,
};
