import type {
  MangleOptions,
  MangleEngineOptions,
  WebManglerPlugin,
} from "../../types";

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
   * The {@link MangleOptions} of every {@link WebManglerPlugin} included.
   */
  private readonly _options: MangleOptions[];

  /**
   * Initialize a {@link MultiMangler} with a fixed set of manglers.
   *
   * @param plugins The manglers to include in the {@link MultiMangler}.
   * @since v0.1.0
   */
  constructor(plugins: WebManglerPlugin[]) {
    this._config = plugins.map((plugin) => plugin.config()).flat();
    this._options = plugins.map((plugin) => plugin.options()).flat();
  }

  /**
   * @inheritDoc
   * @since v0.1.11
   * @deprecated
   */
  config(): MangleEngineOptions[] {
    return this._config;
  }

  /**
   * @inheritDoc
   * @since v0.1.14
   */
  options(): MangleOptions[] {
    return this._options;
  }
}
