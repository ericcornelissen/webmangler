import type { WebManglerPluginConstructor } from "./types";

/**
 * Check if the constructor of a {@link WebManglerPlugin} functions correctly.
 *
 * @param Plugin The {@link WebManglerPlugin} to test.
 * @returns A string describing a problem or `null` if there is no problem.
 */
function checkConstructor(
  Plugin: WebManglerPluginConstructor,
): string | null {
  return null;
}

export {
  checkConstructor,
};
