/**
 * Rewrite characters matchers in a regular expression pattern as a string into
 * case insensitive character matchers.
 *
 * @param pattern The pattern to rewrite.
 * @returns The rewritten pattern.
 */
function rewriteCharacterMatchers(pattern: string): string {
  return pattern.replace(
    /\[.*?\]|([A-z]+)/g,
    (matchedStr, word) => {
      if (word === undefined) {
        return matchedStr;
      }

      return word
        .split("")
        .map((char: string) => `[${char.toLowerCase()}${char.toUpperCase()}]`)
        .join("");
    },
  );
}

/**
 * Rewrite lowercase character ranges in a regular expression pattern as a
 * string into case insensitive character ranges.
 *
 * @param pattern The pattern to rewrite.
 * @returns The rewritten pattern.
 */
function rewriteCharacterRangeLowercase(pattern: string): string {
  return pattern.replace(
    /\[([^\]]*)([a-z])-([a-z])(.*?)\]/g,
    (_, prefix, start, end, suffix) => {
      const lowerCaseRange = `${start.toLowerCase()}-${end.toLowerCase()}`;
      const upperCaseRange = `${start.toUpperCase()}-${end.toUpperCase()}`;

      return `[${prefix}${lowerCaseRange}${upperCaseRange}${suffix}]`;
    },
  );
}

/**
 * Rewrite mixed-case character ranges in a regular expression pattern as a
 * string into case insensitive character ranges.
 *
 * @param pattern The pattern to rewrite.
 * @returns The rewritten pattern.
 */
function rewriteCharacterRangeMixedCase(pattern: string): string {
  return pattern.replace(
    /\[([^\]]*)([A-Z])-([a-z])(.*?)\]/g,
    (_, prefix, start, end, suffix) => {
      const lowerCaseRange1 = `${start.toLowerCase()}-z`;
      const upperCaseRange1 = `${start.toUpperCase()}-Z`;
      const range1 = `${lowerCaseRange1}${upperCaseRange1}`;

      const lowerCaseRange2 = `a-${end.toLowerCase()}`;
      const upperCaseRange2 = `A-${end.toUpperCase()}`;
      const range2 = `${lowerCaseRange2}${upperCaseRange2}`;

      return `[${prefix}${range1}${range2}${suffix}]`;
    },
  );
}

/**
 * Rewrite uppercase character ranges in a regular expression pattern as a
 * string into case insensitive character ranges.
 *
 * @param pattern The pattern to rewrite.
 * @returns The rewritten pattern.
 */
function rewriteCharacterRangeUppercase(pattern: string): string {
  return pattern.replace(
    /\[([^\]]*)([A-Z])-([A-Z])(.*?)\]/g,
    (_, prefix, start, end, suffix) => {
      const lowerCaseRange = `${start.toLowerCase()}-${end.toLowerCase()}`;
      const upperCaseRange = `${start.toUpperCase()}-${end.toUpperCase()}`;

      return `[${prefix}${lowerCaseRange}${upperCaseRange}${suffix}]`;
    },
  );
}

export {
  rewriteCharacterMatchers,
  rewriteCharacterRangeLowercase,
  rewriteCharacterRangeMixedCase,
  rewriteCharacterRangeUppercase,
};
