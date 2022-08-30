import type { CssClassManglerOptions } from "../types";

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
  /cls-[a-zA-Z-_]+/.source,
];

/**
 * The options for getting the {@link CssClassMangler} ignore pattern(s).
 */
type IgnorePatternOptions = Pick<
  CssClassManglerOptions,
  "ignoreClassNamePattern"
>;

/**
 * Get either the configured patterns or the default patterns.
 *
 * @param options The {@link IgnorePatternOptions}.
 * @param options.ignoreClassNamePattern The configured ignore patterns.
 * @returns The ignore patterns to be used.
 */
function getIgnorePatterns({
  ignoreClassNamePattern,
}: IgnorePatternOptions): string | Iterable<string> {
  if (ignoreClassNamePattern === undefined) {
    return DEFAULT_IGNORE_PATTERNS;
  }

  return ignoreClassNamePattern;
}

/**
 * The options for getting the {@link CssClassMangler} pattern(s).
 */
type PatternOptions = Pick<
  CssClassManglerOptions,
  "classNamePattern"
>;

/**
 * Get either the configured patterns or the default patterns.
 *
 * @param options The {@link PatternOptions}.
 * @param options.classNamePattern The configured patterns.
 * @returns The patterns to be used.
 */
function getPatterns({
  classNamePattern,
}: PatternOptions): string | Iterable<string> {
  if (classNamePattern === undefined) {
    return DEFAULT_PATTERNS;
  }

  return classNamePattern;
}

export {
  getIgnorePatterns,
  getPatterns,
};
