import type {
  MangleExpression,
  MangleExpressionOptions,
  WebManglerFile,
  WebManglerOptions,
  WebManglerLanguagePlugin,
} from "./types";

import manglerEngine from "./engine";

/**
 * Retrieve the {@link MangleExpression}s for a given plugin, given its {@link
 * MangleExpressionOptions}, from the {@link WebManglerLanguagePlugin}s.
 *
 * @param languagePlugins The {@link WebManglerLanguagePlugin}s.
 * @param expressionOptions The {@link MangleExpressionOptions}.
 * @returns The {@link MangleExpression}s.
 */
export function getExpressions(
  languagePlugins: WebManglerLanguagePlugin[],
  expressionOptions: MangleExpressionOptions<unknown>[],
): Map<string, MangleExpression[]> {
  const pluginExpressions: Map<string, MangleExpression[]> = new Map();
  for (const languagePlugin of languagePlugins) {
    const languageExpressions: MangleExpression[] = [];
    for (const { name, options } of expressionOptions) {
      const expressions = languagePlugin.getExpressionsFor(name, options);
      languageExpressions.push(...expressions);
    }

    const languages = languagePlugin.getLanguages();
    for (const language of languages) {
      pluginExpressions.set(language, languageExpressions);
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
 * @version v0.1.14
 */
export default function webmangler<File extends WebManglerFile>(
  files: File[],
  options: WebManglerOptions,
): File[] {
  const configs = options.plugins.map((plugin) => plugin.options()).flat();
  for (const config of configs) {
    const expressions = getExpressions(
      options.languages,
      config.expressionOptions,
    );

    files = manglerEngine(files, expressions, config);
  }

  return files;
}

export type { WebManglerFile, WebManglerOptions };
export type { WebManglerPlugin, WebManglerLanguagePlugin } from "./types";
