/**
 * The ignore patterns used by default if none are provided to a
 * {@link HtmlIdMangler}.
 */
const DEFAULT_IGNORE_PATTERNS: Iterable<string> = [
  // No patterns are ignored by default.
];

/**
 * The patterns used by default if none are provided to a
 * {@link HtmlIdMangler}.
 */
const DEFAULT_PATTERNS: Iterable<string> = [
  "id-[a-zA-Z-_]+",
];

/**
 * The options for HTML id mangler ignore patterns.
 */
interface IgnorePatternOptions {
  /**
   * One or more patterns for HTML ids that should **never** be mangled, if any.
   */
  readonly ignoreIdNamePattern?: string | Iterable<string>;
}

/**
 * Get either the configured patterns or the default patterns.
 *
 * @param options The {@link IgnorePatternOptions}.
 * @param options.ignoreIdNamePattern The configured ignore patterns.
 * @returns The ignore patterns to be used.
 */
function getIgnorePatterns({
  ignoreIdNamePattern,
}: IgnorePatternOptions): string | Iterable<string> {
  if (ignoreIdNamePattern === undefined) {
    return DEFAULT_IGNORE_PATTERNS;
  }

  return ignoreIdNamePattern;
}

/**
 * The options for HTML id mangler patterns.
 */
interface PatternOptions {
  /**
   * One or more patterns for HTML ids that should be mangled, if any.
   */
  readonly idNamePattern?: string | Iterable<string>;
}

/**
 * Get either the configured patterns or the default patterns.
 *
 * @param options The {@link PatternOptions}.
 * @param options.idNamePattern The configured patterns.
 * @returns The patterns to be used.
 */
function getPatterns({
  idNamePattern,
}: PatternOptions): string | Iterable<string> {
  if (idNamePattern === undefined) {
    return DEFAULT_PATTERNS;
  }

  return idNamePattern;
}

export {
  getIgnorePatterns,
  getPatterns,
};
