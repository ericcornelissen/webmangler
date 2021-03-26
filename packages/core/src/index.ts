import type {
  MangleExpression,
  MangleExpressionOptions,
  MangleOptions,
  WebManglerFile,
  WebManglerOptions,
  WebManglerPlugin,
  WebManglerLanguagePlugin,
} from "./types";

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
 * @param expressionOptions The {@link MangleExpressionOptions}.
 * @returns The {@link MangleExpression}s.
 * @version v0.1.14
 */
export function getExpressions(
  languagePlugins: Iterable<WebManglerLanguagePlugin>,
  expressionOptions: Iterable<MangleExpressionOptions<unknown>>,
): Map<string, MangleExpression[]> {
  const pluginExpressions: Map<string, MangleExpression[]> = new Map();
  for (const languagePlugin of languagePlugins) {
    for (const { name, options } of expressionOptions) {
      const expressionsMap = languagePlugin.getExpressions(name, options);
      expressionsMap.forEach((newExpressions, language) => {
        const expressions = pluginExpressions.get(language) || [];
        pluginExpressions.set(language, expressions.concat(newExpressions));
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
 * @version v0.1.17
 */
export default function webmangler<File extends WebManglerFile>(
  files: File[],
  options: WebManglerOptions,
): File[] {
  const configs = extractOptions(options.plugins);
  for (const config of configs) {
    const expressions = getExpressions(
      options.languages,
      config.languageOptions || config.expressionOptions,
    );

    files = manglerEngine(files, expressions, config);
  }

  return files;
}

export type {
  WebManglerFile,
  WebManglerOptions,
  WebManglerPlugin,
  WebManglerLanguagePlugin,
};
