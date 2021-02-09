import type { ManglerFile, WebManglerOptions } from "./types";

import manglerEngine from "./engine";

/**
 * Mangle a list of files collectively - i.e. mangle matched strings the same in
 * every file - given certain options.
 *
 * @param files The files to mangle.
 * @param options The options for the mangler.
 * @returns The mangled files.
 * @since v0.1.0
 */
export default function webmangler<File extends ManglerFile>(
  files: File[],
  options: WebManglerOptions,
): File[] {
  for (const plugin of options.plugins) {
    for (const languagePlugin of options.languages) {
      plugin.use(languagePlugin);
    }

    files = plugin.mangle(manglerEngine, files);
  }

  return files;
}

export type { ManglerFile, WebManglerOptions };
export type { WebManglerPlugin } from "./manglers";
export type { WebManglerLanguagePlugin } from "./languages";
