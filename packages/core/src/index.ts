import type { Collection } from "@webmangler/types";

import type {
  MangleExpression,
  MangleExpressionOptions,
  MangleOptions,
  WebManglerFile,
  WebManglerOptions,
  WebManglerPlugin,
  WebManglerLanguagePlugin,
} from "./types";

import { getEmbeds, reEmbed } from "./embeds";
import manglerEngine from "./engine";
import { toArrayIfNeeded } from "./helpers";

/**
 * Extract the {@link MangleOptions} from a collection of plugins.
 *
 * @param plugins The {@link WebManglerPlugin}s.
 * @returns The {@link MangleOptions}.
 */
function extractOptions(
  plugins: Iterable<WebManglerPlugin>,
): Iterable<MangleOptions> {
  const result: MangleOptions[] = [];
  for (const plugin of plugins) {
    const pluginOptions = plugin.options();
    result.push(...toArrayIfNeeded(pluginOptions));
  }

  return result;
}

/**
 * Retrieve the {@link MangleExpression}s for a given plugin, given its {@link
 * MangleExpressionOptions}, from the {@link WebManglerLanguagePlugin}s.
 *
 * @param languagePlugins The {@link WebManglerLanguagePlugin}s.
 * @param languageOptions The {@link MangleExpressionOptions}.
 * @returns The {@link MangleExpression}s.
 */
function getExpressions(
  languagePlugins: Iterable<WebManglerLanguagePlugin>,
  languageOptions: Iterable<MangleExpressionOptions<unknown>>,
): Map<string, Iterable<MangleExpression>> {
  const pluginExpressions: Map<string, Iterable<MangleExpression>> = new Map();
  for (const languagePlugin of languagePlugins) {
    for (const { name, options } of languageOptions) {
      const expressionsMap = languagePlugin.getExpressions(name, options);
      expressionsMap.forEach((newExpressions, language) => {
        const expressions = pluginExpressions.get(language) || [];
        pluginExpressions.set(language, [...expressions, ...newExpressions]);
      });
    }
  }

  return pluginExpressions;
}

/**
 * Mangle a list of files collectively - i.e. mangle matched strings the same in
 * every file - given certain options.
 *
 * @param files The files to mangle.
 * @param options The options for the mangler.
 * @returns The mangled files.
 * @since v0.1.0
 * @version v0.1.26
 */
function webmangler<Files extends Collection<WebManglerFile>>(
  files: Files,
  options: WebManglerOptions,
): { files: Files; } {
  const embedsMap = getEmbeds(files, options.languages);

  const filesAndEmbeds = Array.from(files);
  embedsMap.forEach((embeds) => filesAndEmbeds.push(...embeds));

  const configs = extractOptions(options.plugins);
  for (const config of configs) {
    const expressions = getExpressions(
      options.languages,
      config.languageOptions,
    );

    manglerEngine(filesAndEmbeds, expressions, config);
  }

  embedsMap.forEach(reEmbed);
  return { files };
}

export default webmangler;

export type {
  WebManglerFile,
  WebManglerOptions,
  WebManglerPlugin,
  WebManglerLanguagePlugin,
};
