import type {
  CharSet,
  MangleOptions,
  MangleExpressionOptions,
  WebManglerPlugin,
} from "@webmangler/types";

/**
 * The type of the {@link SimpleManglerPlugin} abstract constructor.
 */
type SimpleManglerPluginConstructor = abstract new (
  options: SimpleManglerOptions,
) => WebManglerPlugin;

/**
 * The interface defining the dependencies of the {@link SimpleManglerPlugin}
 * abstract class.
 */
type SimpleManglerPluginDependencies = Record<never, never>;

/**
 * Interface defining the configuration of a {@link SimpleManglerPlugin}.
 *
 * @since v0.1.0
 * @version v0.1.28
 */
interface SimpleManglerOptions {
  /**
   * The character set to use when mangling.
   *
   * @since v0.1.7
   * @version v0.1.28
   */
  readonly charSet: CharSet;

  /**
   * One or more patterns that should **never** be mangled.
   *
   * @since v0.1.23
   * @version v0.1.28
   */
  readonly ignorePatterns: string | Iterable<string>;

  /**
   * The configuration for the {@link WebManglerLanguagePlugin}s.
   *
   * @since v0.1.17
   * @version v0.1.28
   */
  readonly languageOptions: Iterable<MangleExpressionOptions<unknown>>;

  /**
   * One or more patterns that should be mangled.
   *
   * @since v0.1.0
   * @version v0.1.28
   */
  readonly patterns: string | Iterable<string>;

  /**
   * A list of names that should not be outputted by the mangler.
   *
   * @since v0.1.0
   * @version v0.1.28
   */
  readonly reserved: Iterable<string>;

  /**
   * The prefix to use whe mangling.
   *
   * @since v0.1.0
   * @version v0.1.28
   */
  readonly prefix: string;
}

/**
 * Initialize the {@link SimpleManglerPlugin} abstract class with explicit
 * dependencies.
 *
 * @param params The dependencies of the abstract class.
 * @returns The {@link SimpleManglerPlugin} abstract class.
 */
function initSimpleManglerPlugin(
  params: SimpleManglerPluginDependencies, // eslint-disable-line @typescript-eslint/no-unused-vars
): SimpleManglerPluginConstructor {
  abstract class SimpleManglerPlugin implements WebManglerPlugin {
    /**
     * The character set to use when mangling.
     */
    private readonly charSet: CharSet;

    /**
     * The pattern(s) that should **never** be mangled.
     */
    private readonly ignorePatterns: string | Iterable<string>;

    /**
     * The configuration for the {@link WebManglerLanguagePlugin}s.
     */
    private readonly languageOptions:
      Iterable<MangleExpressionOptions<unknown>>;

    /**
     * The pattern(s) to be mangled.
     */
    private readonly patterns: string | Iterable<string>;

    /**
     * The prefix to be used by this mangler.
     */
    private readonly prefix: string;

    /**
     * The reserved names not to be used by this mangler.
     */
    private readonly reserved: Iterable<string>;

    /**
     * Initialize a new {@link WebManglerPlugin}.
     *
     * @param options The {@link SimpleManglerOptions}.
     * @since v0.1.0
     * @version v0.1.28
     */
    constructor(options: SimpleManglerOptions) {
      this.charSet = options.charSet;
      this.ignorePatterns = options.ignorePatterns;
      this.languageOptions = options.languageOptions;
      this.patterns = options.patterns;
      this.prefix = options.prefix;
      this.reserved = options.reserved;
    }

    /**
     * @inheritDoc
     * @since v0.1.14
     * @version v0.1.23
     */
    options(): MangleOptions {
      return {
        charSet: this.charSet,
        ignorePatterns: this.ignorePatterns,
        languageOptions: this.languageOptions,
        manglePrefix: this.prefix,
        patterns: this.patterns,
        reservedNames: this.reserved,
      };
    }
  }

  return SimpleManglerPlugin;
}

export default initSimpleManglerPlugin;

export type {
  SimpleManglerOptions,
};
