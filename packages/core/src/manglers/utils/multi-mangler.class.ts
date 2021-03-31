import type { MangleOptions, WebManglerPlugin } from "../../types";

import { toArrayIfNeeded } from "../../helpers";

/**
 * The {@link MultiManglerPlugin} class is a utility to create a {@link
 * WebManglerPlugin} that provides multiple manglers in one plugin.
 *
 * {@link MultiManglerPlugin} is used to implement {@link RecommendedManglers}
 * and {@link BuiltInManglers}.
 *
 * @since v0.1.0
 * @version v0.1.17
 */
export default abstract class MultiManglerPlugin implements WebManglerPlugin {
  /**
   * The {@link MangleOptions} of every {@link WebManglerPlugin} included.
   */
  private readonly _options: MangleOptions[] = [];

  /**
   * Initialize a {@link MultiManglerPlugin} with a fixed set of manglers.
   *
   * @param plugins The manglers to include in the {@link MultiManglerPlugin}.
   * @since v0.1.0
   * @version v0.1.17
   */
  constructor(plugins: Iterable<WebManglerPlugin>) {
    for (const plugin of plugins) {
      const pluginOptions = plugin.options();
      this._options.push(...toArrayIfNeeded(pluginOptions));
    }
  }

  /**
   * @inheritDoc
   * @since v0.1.14
   * @version v0.1.17
   */
  options(): Iterable<MangleOptions> {
    return this._options;
  }
}
