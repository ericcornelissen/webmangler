import type {
  MangleOptions,
  ReadonlyCollection,
  WebManglerPlugin,
} from "@webmangler/types";

/**
 * The type of the {@link MultiManglerPlugin} abstract constructor.
 */
type MultiManglerPluginConstructor = abstract new (
  plugins: ReadonlyCollection<WebManglerPlugin>,
) => WebManglerPlugin;

/**
 * The interface defining the dependencies of the {@link MultiManglerPlugin}
 * abstract class.
 */
interface MultiManglerPluginDependencies {
  /**
   * A function to convert a value that may be an {@link Iterable} or not into
   * an {@link Iterable}.
   *
   * @param input An optionally {@link Iterable} value.
   * @returns An {@link Iterable} value.
   */
  toArrayIfNeeded: (
    input: MangleOptions | Iterable<MangleOptions>,
  ) => Iterable<MangleOptions>;
}

/**
 * Initialize the {@link MultiManglerPlugin} abstract class with explicit
 * dependencies.
 *
 * @param params The dependencies of the class.
 * @param params.toArrayIfNeeded Function to convert non-array values to arrays.
 * @returns The {@link MultiManglerPlugin} abstract class.
 */
function initMultiManglerPlugin({
  toArrayIfNeeded,
}: MultiManglerPluginDependencies): MultiManglerPluginConstructor {
  abstract class MultiManglerPlugin implements WebManglerPlugin {
    /**
     * The {@link MangleOptions} of every {@link WebManglerPlugin} included.
     */
    private readonly _options: ReadonlyCollection<MangleOptions>;

    /**
     * Initialize a {@link MultiManglerPlugin} with a fixed set of manglers.
     *
     * @param plugins The manglers to include in the {@link MultiManglerPlugin}.
     * @since v0.1.0
     * @version v0.1.28
     */
    constructor(
      plugins: ReadonlyCollection<WebManglerPlugin>,
    ) {
      const options: MangleOptions[] = [];
      for (const plugin of plugins) {
        const pluginOptions = plugin.options();
        options.push(...toArrayIfNeeded(pluginOptions));
      }

      this._options = options;
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

  return MultiManglerPlugin;
}

export default initMultiManglerPlugin;
