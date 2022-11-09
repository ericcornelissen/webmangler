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
  try {
    new Plugin(); // eslint-disable-line no-new
  } catch (error) {
    return `plugin initialized without options failed (error: ${error})`;
  }

  try {
    new Plugin({ }); // eslint-disable-line no-new
  } catch (error) {
    return `plugin initialized with empty options failed (error: ${error})`;
  }

  return null;
}

export {
  checkConstructor,
};
