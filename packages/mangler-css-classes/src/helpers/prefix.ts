/**
 * The default prefix used by a {@link CssClassMangler}.
 */
const DEFAULT_PREFIX = "";

/**
 * Get either the configured prefix or the default prefix.
 *
 * @param keepClassNamePrefix The configured prefix.
 * @returns The prefix to be used.
 */
function getPrefix(keepClassNamePrefix?: string): string {
  if (keepClassNamePrefix === undefined) {
    return DEFAULT_PREFIX;
  }

  return keepClassNamePrefix;
}

export {
  getPrefix,
};
