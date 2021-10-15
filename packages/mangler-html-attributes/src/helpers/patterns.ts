/**
 * The ignore patterns used by default if none are provided to a {@link
 * HtmlAttributeMangler}.
 */
const DEFAULT_IGNORE_PATTERNS: string[] = [
  // No attribute patterns are ignored by default.
];

/**
 * The patterns used by default if none are provided to a {@link
 * HtmlAttributeMangler}.
 */
const DEFAULT_PATTERNS: string[] = [
  "data-[a-z-]+",
];

/**
 * Get either the configured patterns or the default patterns.
 *
 * @param ignoreAttrNamePattern The configured ignore patterns.
 * @returns The ignore patterns to be used.
 */
 function getIgnorePatterns(
  ignoreAttrNamePattern?: string | Iterable<string>,
): string | Iterable<string> {
  if (ignoreAttrNamePattern === undefined) {
    return DEFAULT_IGNORE_PATTERNS;
  }

  return ignoreAttrNamePattern;
}

/**
 * Get either the configured patterns or the default patterns.
 *
 * @param attrNamePattern The configured patterns.
 * @returns The patterns to be used.
 */
function getPatterns(
  attrNamePattern?: string | Iterable<string>,
): string | Iterable<string> {
  if (attrNamePattern === undefined) {
    return DEFAULT_PATTERNS;
  }

  return attrNamePattern;
}

export {
  getIgnorePatterns,
  getPatterns,
};
