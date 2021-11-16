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
 * The options for CSS variable mangler ignore patterns.
 */
 interface IgnorePatternOptions {
  /**
   * One or more patterns for CSS variables that should **never** be mangled, if
   * any.
   */
  readonly ignoreCssVarNamePattern?: string | Iterable<string>;
}

/**
 * Get either the configured patterns or the default patterns.
 *
 * @param options The {@link IgnorePatternOptions}.
 * @param options.ignoreCssVarNamePattern The configured ignore patterns.
 * @returns The ignore patterns to be used.
 */
function getIgnorePatterns({
  ignoreCssVarNamePattern,
}: IgnorePatternOptions): string | Iterable<string> {
  if (ignoreCssVarNamePattern === undefined) {
    return DEFAULT_IGNORE_PATTERNS;
  }

  return ignoreCssVarNamePattern;
}

/**
 * The options for CSS variable mangler patterns.
 */
 interface PatternOptions {
  /**
   * One or more patterns for CSS variables that should be mangled, if any.
   */
  readonly cssVarNamePattern?: string | Iterable<string>;
}

/**
 * Get either the configured patterns or the default patterns.
 *
 * @param options The {@link PatternOptions}.
 * @param options.cssVarNamePattern The configured patterns.
 * @returns The patterns to be used.
 */
function getPatterns({
  cssVarNamePattern,
}: PatternOptions): string | Iterable<string> {
  if (cssVarNamePattern === undefined) {
    return DEFAULT_PATTERNS;
  }

  return cssVarNamePattern;
}

export {
  getIgnorePatterns,
  getPatterns,
};
