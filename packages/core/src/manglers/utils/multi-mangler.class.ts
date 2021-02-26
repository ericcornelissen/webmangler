import type { MangleEngineOptions, WebManglerPlugin } from "../../types";

/**
 * The {@link MultiMangler} class is a utility to create a {@link
 * WebManglerPlugin} that provides multiple manglers in one plugin.
 *
 * {@link MultiMangler} is used to implement {@link RecommendedManglers} and
 * {@link BuiltInManglers}.
 *
 * @since v0.1.0
 * @version v0.1.14
 */
export default abstract class MultiMangler implements WebManglerPlugin {
  /**
   * The {@link MangleEngineOptions}.
   */
  private readonly _config: MangleEngineOptions[];

  /**
   * Initialize a {@link MultiMangler} with a fixed set of manglers.
   *
   * @param plugins The manglers to include in the {@link MultiMangler}.
   * @since v0.1.0
   */
  constructor(plugins: WebManglerPlugin[]) {
    this._config = plugins.map((plugin) => plugin.config()).flat();
  }

  /**
   * @inheritDoc
   * @since v0.1.11
   */
  config(): MangleEngineOptions[] {
    return this._config;
  }
}
