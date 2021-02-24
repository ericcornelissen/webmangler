import type {
  ManglerExpression,
  WebManglerFile,
  WebManglerOptions,
  WebManglerLanguagePlugin,
} from "./types";

import manglerEngine from "./engine";

/**
 * Retrieve the {@link ManglerExpression}s for a given plugin from the {@link
 * WebManglerLanguagePlugin}s.
 *
 * @param languages The {@link WebManglerLanguagePlugin}s.
 * @param pluginId The plugin identifier.
 * @returns The {@link ManglerExpression}.
 */
function getExpressions(
  languages: WebManglerLanguagePlugin[],
  pluginId: string,
): Map<string, ManglerExpression[]> {
  const pluginExpressions: Map<string, ManglerExpression[]> = new Map();
  for (const languagePlugin of languages) {
    const langExpressions = languagePlugin.getExpressions(pluginId);
    langExpressions.forEach((value, key) => pluginExpressions.set(key, value));
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
 * @version v0.1.13
 */
export default function webmangler<File extends WebManglerFile>(
  files: File[],
  options: WebManglerOptions,
): File[] {
  const configs = options.plugins.map((plugin) => plugin.config()).flat();
  for (const config of configs) {
    const expressions = getExpressions(options.languages, config.id);
    files = manglerEngine(files, expressions, config);
  }

  return files;
}

export type { WebManglerFile, WebManglerOptions };
export type { WebManglerPlugin, WebManglerLanguagePlugin } from "./types";
