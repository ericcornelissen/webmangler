/**
 * The default prefix used by a {@link HtmlAttributeMangler}.
 */
const DEFAULT_PREFIX = "data-";

/**
 * The options for the HTML attribute mangler prefix.
 */
interface PrefixOptions {
  /**
   * A prefix to use for mangled HTML attributes, if any.
   */
  readonly keepAttrPrefix?: string;
}

/**
 * Get either the configured prefix or the default prefix.
 *
 * @param options The {@link PrefixOptions}.
 * @param options.keepAttrPrefix The configured prefix.
 * @returns The prefix to be used.
 */
function getPrefix({
  keepAttrPrefix,
}: PrefixOptions): string {
  if (keepAttrPrefix === undefined) {
    return DEFAULT_PREFIX;
  }

  return keepAttrPrefix;
}

export {
  getPrefix,
};
