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
  try {
    const plugin = new Plugin();

    const options = plugin.options();
    if (!options) {
      return `no options returned by plugin (got ${options})`;
    }
  } catch (error) {
    return `cannot get options from plugin (error: ${error})`;
  }

  return null;
}

export {
  checkOptions,
};
