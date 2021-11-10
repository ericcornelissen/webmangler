/**
 * The default prefix used by a {@link CssVariableMangler}.
 */
const DEFAULT_PREFIX = "";

/**
 * The options for the CSS variable mangler prefix.
 */
interface PrefixOptions {
  /**
   * The prefix to use for mangled CSS variables, if any.
   */
  readonly keepCssVarPrefix?: string;
}

/**
 * Get either the configured prefix or the default prefix.
 *
 * @param options The {@link PrefixOptions}.
 * @param options.keepCssVarPrefix The configured prefix.
 * @returns The prefix to be used.
 */
function getPrefix({
  keepCssVarPrefix,
}: PrefixOptions): string {
  if (keepCssVarPrefix === undefined) {
    return DEFAULT_PREFIX;
  }

  return keepCssVarPrefix;
}

export {
  getPrefix,
};
