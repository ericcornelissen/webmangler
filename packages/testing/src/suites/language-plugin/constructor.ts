import type { WebManglerLanguagePluginConstructor } from "./types";

/**
 * Check if the constructor of a {@link WebManglerLanguagePlugin} functions
 * correctly.
 *
 * @param Plugin The {@link WebManglerLanguagePlugin} to test.
 * @returns A string describing a problem or `null` if there is no problem.
 */
function checkConstructor(
  Plugin: WebManglerLanguagePluginConstructor,
): string | null {
  return null;
}

export {
  checkConstructor,
};
