import type { WebManglerFile } from"@webmangler/types";

import type { WebManglerLanguagePluginConstructor } from "./types";

/**
 * Check if the `getEmbeds` method of a {@link WebManglerLanguagePlugin}
 * functions correctly.
 *
 * @param Plugin The {@link WebManglerLanguagePlugin} to test.
 * @returns A string describing a problem or `null` if there is no problem.
 */
function checkGetEmbeds(
  Plugin: WebManglerLanguagePluginConstructor,
): string | null {
  return null;
}

/**
 * Check if the `getExpressions` method of a {@link WebManglerLanguagePlugin}
 * functions correctly.
 *
 * @param Plugin The {@link WebManglerLanguagePlugin} to test.
 * @returns A string describing a problem or `null` if there is no problem.
 */
function checkGetExpressions(
  Plugin: WebManglerLanguagePluginConstructor,
): string | null {
  return null;
}

/**
 * Check if the `getLanguages` method of a {@link WebManglerLanguagePlugin}
 * functions correctly.
 *
 * @param Plugin The {@link WebManglerLanguagePlugin} to test.
 * @returns A string describing a problem or `null` if there is no problem.
 */
function checkGetLanguages(
  Plugin: WebManglerLanguagePluginConstructor,
): string | null {
  return null;
}

export {
  checkGetEmbeds,
  checkGetExpressions,
  checkGetLanguages,
};
