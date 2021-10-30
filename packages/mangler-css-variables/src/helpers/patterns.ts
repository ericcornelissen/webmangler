/**
 * The ignore patterns used by default if none are provided to a
 * {@link CssVariableMangler}.
 */
const DEFAULT_IGNORE_PATTERNS: Iterable<string> = [
  // No patterns are ignored by default.
];

/**
 * The patterns used by default if none are provided to a
 * {@link CssVariableMangler}.
 */
const DEFAULT_PATTERNS: Iterable<string> = [
  "[a-zA-Z-]+",
];

/**
 * Get either the configured patterns or the default patterns.
 *
 * @param ignoreCssVarNamePattern The configured ignore patterns.
 * @returns The ignore patterns to be used.
 */
function getIgnorePatterns(
  ignoreCssVarNamePattern?: string | Iterable<string>,
): string | Iterable<string> {
  if (ignoreCssVarNamePattern === undefined) {
    return DEFAULT_IGNORE_PATTERNS;
  }

  return ignoreCssVarNamePattern;
}

/**
 * Get either the configured patterns or the default patterns.
 *
 * @param cssVarNamePattern The configured patterns.
 * @returns The patterns to be used.
 */
function getPatterns(
  cssVarNamePattern?: string | Iterable<string>,
): string | Iterable<string> {
  if (cssVarNamePattern === undefined) {
    return DEFAULT_PATTERNS;
  }

  return cssVarNamePattern;
}

export {
  getIgnorePatterns,
  getPatterns,
};
