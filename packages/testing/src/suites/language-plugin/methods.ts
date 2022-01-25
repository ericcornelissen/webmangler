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
  const file: WebManglerFile = {
    content: "",
    type: "invalid",
  };

  try {
    const plugin = new Plugin();

    const embeds = plugin.getEmbeds(file);
    if (!embeds) {
      return `no list of embeds returned by plugin (got ${embeds})`;
    }
  } catch (error) {
    return `cannot get embeds from plugin (error: ${error})`;
  }

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
  const name = "name";
  const options = {};

  try {
    const plugin = new Plugin();

    const expressions = plugin.getExpressions(name, options);
    if (!expressions) {
      return `no list of expressions returned by plugin (got ${expressions})`;
    }
  } catch (error) {
    return `cannot get expressions from plugin (error: ${error})`;
  }

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
  try {
    const plugin = new Plugin();

    const languages = plugin.getLanguages();
    if (!languages) {
      return `no list of languages returned by plugin (got ${languages})`;
    }
  } catch (error) {
    return `cannot get languages from plugin (error: ${error})`;
  }

  return null;
}

export {
  checkGetEmbeds,
  checkGetExpressions,
  checkGetLanguages,
};
