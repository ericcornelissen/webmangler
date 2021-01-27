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
export default function webmangler(
  files: ManglerFile[],
  options: WebManglerOptions,
): ManglerFile[] {
  for (const plugin of options.plugins) {
    for (const languagePlugin of options.languages) {
      plugin.use(languagePlugin);
    }

    files = plugin.mangle(manglerEngine, files);
  }

  return files;
}
