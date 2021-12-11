/**
 * The default prefix used by a {@link HtmlIdMangler}.
 */
const DEFAULT_PREFIX = "";

/**
 * The options for the HTML id mangler prefix.
 */
interface PrefixOptions {
  /**
   * The prefix to use for mangled CSS variables, if any.
   */
  readonly keepIdPrefix?: string;
}

/**
 * Get either the configured prefix or the default prefix.
 *
 * @param options The {@link PrefixOptions}.
 * @param options.keepIdPrefix The configured prefix.
 * @returns The prefix to be used.
 */
function getPrefix({
  keepIdPrefix,
}: PrefixOptions): string {
  if (keepIdPrefix === undefined) {
    return DEFAULT_PREFIX;
  }

  return keepIdPrefix;
}

export {
  getPrefix,
};
