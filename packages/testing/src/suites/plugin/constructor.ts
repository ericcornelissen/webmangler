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
  try {
    new Plugin();
  } catch (error) {
    return `plugin initialized without options failed (error: ${error})`;
  }

  try {
    new Plugin({ });
  } catch (error) {
    return `plugin initialized with empty options failed (error: ${error})`;
  }

  return null;
}

export {
  checkConstructor,
};
