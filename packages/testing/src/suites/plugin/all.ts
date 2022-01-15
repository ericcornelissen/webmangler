import type { WebManglerPluginConstructor } from "./types";

/**
 * A function that checks the validity of a {@link WebManglerPlugin}.
 */
type WebManglerPluginCheck = (
  Plugin: WebManglerPluginConstructor,
) => string | null;

/**
 * A collection of functions that checks the validity of a
 * {@link WebManglerPlugin}.
 */
type WebManglerPluginChecks = Iterable<WebManglerPluginCheck>;

/**
 * Create a function to check the validity of a {@link WebManglerPlugin}.
 *
 * @param checks The checks.
 * @returns A function that uses `checks` to validate a plugin.
 */
function newCheckWebManglerPlugin(
  checks: WebManglerPluginChecks,
) {
  return (
    Plugin: WebManglerPluginConstructor,
  ): [boolean, string] => {
    for (const check of checks) {
      const response = check(Plugin);
      if (response) return [false, response];
    }

    return [true, ""];
  };
}

export {
  newCheckWebManglerPlugin,
};
