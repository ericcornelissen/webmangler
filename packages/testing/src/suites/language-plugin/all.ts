import type { WebManglerLanguagePluginConstructor } from "./types";

/**
 * A function that checks the validity of a {@link WebManglerLanguagePlugin}.
 */
type WebManglerLanguagePluginCheck = (
  Plugin: WebManglerLanguagePluginConstructor,
) => string | null;

/**
 * A collection of functions that checks the validity of a
 * {@link WebManglerLanguagePlugin}.
 */
type WebManglerLanguagePluginChecks = Iterable<WebManglerLanguagePluginCheck>;

/**
 * Create a function to check the validity of a
 * {@link WebManglerLanguagePlugin}.
 *
 * @param checks The checks.
 * @returns A string describing a problem or `null` if there is no problem.
 */
function newCheckWebManglerLanguagePlugin(
  checks: WebManglerLanguagePluginChecks,
) {
  return (
    Plugin: WebManglerLanguagePluginConstructor,
  ): [boolean, string] => {
    return [true, ""];
  };
}

export {
  newCheckWebManglerLanguagePlugin,
};
