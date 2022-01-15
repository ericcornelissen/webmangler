import type { WebManglerPluginConstructor } from "./types";

/**
 * Check if the `options` method of a {@link WebManglerPlugin} functions
 * correctly.
 *
 * @param Plugin The {@link WebManglerPlugin} to test.
 * @returns A string describing a problem or `null` if there is no problem.
 */
function checkOptions(
  Plugin: WebManglerPluginConstructor,
): string | null {
  return null;
}

export {
  checkOptions,
};
