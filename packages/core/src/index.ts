import type { WebManglerFile, WebManglerOptions } from "./types";

import manglerEngine from "./engine";
import { toArrayIfNeeded } from "./helpers";

/**
 * Mangle a list of files collectively - i.e. mangle matched strings the same in
 * every file - given certain options.
 *
 * @param files The files to mangle.
 * @param options The options for the mangler.
 * @returns The mangled files.
 * @since v0.1.0
 * @version v0.1.11
 */
export default function webmangler<File extends WebManglerFile>(
  files: File[],
  options: WebManglerOptions,
): File[] {
  for (const plugin of options.plugins) {
    for (const languagePlugin of options.languages) {
      plugin.use(languagePlugin);
    }

    const allManglerOptions = toArrayIfNeeded(plugin.config());
    for (const manglerOptions of allManglerOptions) {
      files = manglerEngine(files, manglerOptions);
    }
  }

  return files;
}

export type { WebManglerFile, WebManglerOptions };
export type { WebManglerPlugin } from "./types";
export type { WebManglerLanguagePlugin } from "./languages";
