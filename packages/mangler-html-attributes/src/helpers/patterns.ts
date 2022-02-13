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
 * The options for HTML attribute mangler ignore patterns.
 */
interface IgnorePatternOptions {
  /**
   * One or more patterns for HTML attributes that should **never** be mangled,
   * if any.
   */
  readonly ignoreAttrNamePattern?: string | Iterable<string>;
}

/**
 * Get either the configured patterns or the default patterns.
 *
 * @param options The {@link IgnorePatternOptions}.
 * @param options.ignoreAttrNamePattern The configured ignore patterns.
 * @returns The ignore patterns to be used.
 */
function getIgnorePatterns({
  ignoreAttrNamePattern,
}: IgnorePatternOptions): string | Iterable<string> {
  if (ignoreAttrNamePattern === undefined) {
    return DEFAULT_IGNORE_PATTERNS;
  }

  return ignoreAttrNamePattern;
}

/**
 * The options for HTML attribute mangler patterns.
 */
interface PatternOptions {
  /**
   * One or more patterns for HTML attributes that should be mangled, if any.
   */
  readonly attrNamePattern?: string | Iterable<string>;
}

/**
 * Get either the configured patterns or the default patterns.
 *
 * @param options The {@link PatternOptions}.
 * @param options.attrNamePattern The configured patterns.
 * @returns The patterns to be used.
 */
function getPatterns({
  attrNamePattern,
}: PatternOptions): string | Iterable<string> {
  if (attrNamePattern === undefined) {
    return DEFAULT_PATTERNS;
  }

  return attrNamePattern;
}

export {
  getIgnorePatterns,
  getPatterns,
};
