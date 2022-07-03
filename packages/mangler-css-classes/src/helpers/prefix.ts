import type { CssClassManglerOptions } from "../types";

/**
 * The default prefix used by a {@link CssClassMangler}.
 */
const DEFAULT_PREFIX = "";

/**
 * The options for getting the {@link CssClassMangler} class name prefix.
 */
type PrefixOptions = Pick<
  CssClassManglerOptions,
  "keepClassNamePrefix"
>;

/**
 * Get either the configured prefix or the default prefix.
 *
 * @param options The {@link PrefixOptions}.
 * @param options.keepClassNamePrefix The configured prefix.
 * @returns The prefix to be used.
 */
function getPrefix({
  keepClassNamePrefix,
}: PrefixOptions): string {
  if (keepClassNamePrefix === undefined) {
    return DEFAULT_PREFIX;
  }

  return keepClassNamePrefix;
}

export {
  getPrefix,
};
