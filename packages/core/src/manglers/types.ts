import type { WebManglerLanguagePlugin } from "../languages";
import type { MangleEngine, ManglerFile } from "../types";

/**
 * The interface that every plugin for _WebMangler_ must implement.
 *
 * @since v0.1.0
 */
interface WebManglerPlugin {
  /**
   * Mangle a set of `files` with this {@link WebManglerPlugin}.
   *
   * It is recommended for the plugin to use the `mangleEngine` to do the
   * mangling.
   *
   * @param mangleEngine The _WebMangler_ core mangling engine.
   * @param files The files to be mangled.
   * @returns The mangled files.
   * @since v0.1.0
   */
  mangle(mangleEngine: MangleEngine, files: ManglerFile[]): ManglerFile[];

  /**
   * Instruct the {@link WebManglerPlugin} to use the {@link ManglerExpression}s
   * specified by a {@link WebManglerLanguagePlugin}.
   *
   * @param languagePlugin The {@link WebManglerLanguagePlugin} to be used.
   * @since v0.1.0
   */
  use(languagePlugin: WebManglerLanguagePlugin): void;
}

export type { WebManglerPlugin };
