import type {
  CharSet,
  MangleOptions,
  MangleExpressionOptions,
  WebManglerPlugin,
} from "@webmangler/types";

/**
 * Interface defining the configuration of a {@link SimpleManglerPlugin}.
 *
 * @since v0.1.0
 * @version v0.1.23
 */
export interface SimpleManglerOptions {
  /**
   * The character set to use when mangling.
   *
   * @since v0.1.7
   */
  charSet: CharSet;

  /**
   * One or more patterns that should **never** be mangled.
   *
   * @since v0.1.23
   */
  ignorePatterns: string | Iterable<string>;

  /**
   * The configuration for the {@link WebManglerLanguagePlugin}s.
   *
   * @since v0.1.17
   */
  languageOptions: Iterable<MangleExpressionOptions<unknown>>;

  /**
   * One or more patterns that should be mangled.
   *
   * @since v0.1.0
   * @version v0.1.17
   */
  patterns: string | Iterable<string>;

  /**
   * A list of names that should not be outputted by the mangler.
   *
   * @since v0.1.0
   * @version v0.1.17
   */
  reserved: Iterable<string>;

  /**
   * The prefix to use whe mangling.
   *
   * @since v0.1.0
   */
  prefix: string;
}

/**
 * The {@link SimpleManglerPlugin} abstract class provides an implementation of
 * a {@link WebManglerPlugin} that deals with implementing the API if it is
 * provided with the appropriate data.
 *
 * It is recommended to extend this class - or {@link MultiManglerPlugin},
 * depending on your needs - if you're implementing a {@link WebManglerPlugin}.
 *
 * @since v0.1.0
 * @version v0.1.23
 */
export default abstract class SimpleManglerPlugin implements WebManglerPlugin {
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
  private readonly languageOptions: Iterable<MangleExpressionOptions<unknown>>;

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
   * @param options The {@link SimpleManglerOptions} (previously `id`).
   * @since v0.1.0
   * @version v0.1.23
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
