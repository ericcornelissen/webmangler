/**
 * The default prefix used by a {@link CssVariableMangler}.
 */
const DEFAULT_PREFIX = "";

/**
 * Get either the configured prefix or the default prefix.
 *
 * @param keepCssVarPrefix The configured prefix.
 * @returns The prefix to be used.
 */
function getPrefix(keepCssVarPrefix?: string): string {
  if (keepCssVarPrefix === undefined) {
    return DEFAULT_PREFIX;
  }

  return keepCssVarPrefix;
}

export {
  getPrefix,
};
