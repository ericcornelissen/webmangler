/**
 * The ignore patterns used by default if none are provided to a
 * {@link CssClassMangler}.
 */
const DEFAULT_IGNORE_PATTERNS: string[] = [
  // No class patterns are ignored by default.
];

/**
 * The patterns used by default if none are provided to a
 * {@link CssClassMangler}.
 */
const DEFAULT_PATTERNS: string[] = [
  "cls-[a-zA-Z-_]+",
];

/**
 * Get either the configured patterns or the default patterns.
 *
 * @param ignoreClassNamePattern The configured ignore patterns.
 * @returns The ignore patterns to be used.
 */
 function getIgnorePatterns(
  ignoreClassNamePattern?: string | Iterable<string>,
): string | Iterable<string> {
  if (ignoreClassNamePattern === undefined) {
    return DEFAULT_IGNORE_PATTERNS;
  }

  return ignoreClassNamePattern;
}

/**
 * Get either the configured patterns or the default patterns.
 *
 * @param classNamePattern The configured patterns.
 * @returns The patterns to be used.
 */
function getPatterns(
  classNamePattern?: string | Iterable<string>,
): string | Iterable<string> {
  if (classNamePattern === undefined) {
    return DEFAULT_PATTERNS;
  }

  return classNamePattern;
}

export {
  getIgnorePatterns,
  getPatterns,
};
