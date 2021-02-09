import type { WebManglerPlugin } from "../types";
import type { WebManglerLanguagePlugin } from "../../languages";
import type { MangleEngine, ManglerFile } from "../../types";

/**
 * The {@link MultiMangler} class is a utility to create a {@link
 * WebManglerPlugin} that provides multiple manglers in one plugin.
 *
 * {@link MultiMangler} is used to implement {@link RecommendedManglers} and
 * {@link BuiltInManglers}.
 *
 * @since v0.1.0
 */
export default abstract class MultiMangler implements WebManglerPlugin {
  /**
   * The {@link WebManglerPlugin}s in the {@link MultiMangler}.
   */
  private readonly plugins: WebManglerPlugin[];

  /**
   * Initialize a {@link MultiMangler} with a fixed set of manglers.
   *
   * @param plugins The manglers to include in the {@link MultiMangler}.
   * @since v0.1.0
   */
  constructor(plugins: WebManglerPlugin[]) {
    this.plugins = plugins;
  }

  /**
   * Mangles the files using every provided mangler (in order).
   *
   * @inheritDoc
   * @since v0.1.0
   */
  mangle<File extends ManglerFile>(
    mangleEngine: MangleEngine<File>,
    files: File[],
  ): File[] {
    this.plugins.forEach((plugin: WebManglerPlugin) => {
      files = plugin.mangle(mangleEngine, files);
    });

    return files;
  }

  /**
   * Uses the language plugin in every provided mangler.
   *
   * @inheritDoc
   * @since v0.1.0
   */
  use(languagePlugin: WebManglerLanguagePlugin): void {
    this.plugins.forEach((plugin: WebManglerPlugin) => {
      plugin.use(languagePlugin);
    });
  }
}
