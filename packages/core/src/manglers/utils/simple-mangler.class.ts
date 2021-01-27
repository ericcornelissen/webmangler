import BaseManglerPlugin from "./base-mangler.class";

/**
 * Interface defining the configuration of a {@link SimpleLanguagePlugin}.
 *
 * @since v0.1.0
 */
interface SimpleManglerOptions {
  /**
   * One or more patterns that should be mangled.
   *
   * @since v0.1.0
   */
  patterns: string | string[];

  /**
   * A list of names that should not be outputted by the mangler.
   *
   * @since v0.1.0
   */
  reserved: string[];

  /**
   * The prefix to use whe mangling.
   *
   * @since v0.1.0
   */
  prefix: string;
}

/**
 * The {@link SimpleManglerPlugin} abstract class provides an implementation of
 * a {@link WebManglerPlugin} that deals with the handling of {@link
 * WebManglerLanguagePlugin} and implements {@link WebManglerPlugin.mangle} for
 * a given set of patterns, reserved values, and prefix.
 *
 * It is recommended to extend this class - or {@link BaseManglerPlugin} or
 * {@link MultiMangler}, depending on your needs - if you're implementing a
 * {@link WebManglerPlugin}.
 *
 * @since v0.1.0
 */
export default abstract class SimpleManglerPlugin extends BaseManglerPlugin {
  /**
   * The pattern(s) to be mangled.
   */
  private readonly patterns: string | string[];

  /**
   * The reserved names not to be used by this mangler.
   */
  private readonly reserved: string[];

  /**
   * The prefix to be used by this mangler.
   */
  private readonly prefix: string;

  /**
   * Initialize a new {@link WebManglerPlugin}.
   *
   * @param id The identifier for the {@link WebManglerPlugin}.
   * @param options The pattern, reserved values, and prefix.
   */
  constructor(id: string, options: SimpleManglerOptions) {
    super(id);
    this.patterns = options.patterns;
    this.reserved = options.reserved;
    this.prefix = options.prefix;
  }

  /**
   * Mangle the `files` with the configured pattern, reserved values, and
   * prefix.
   *
   * @inheritDoc
   * @since v0.1.0
   */
  mangle(mangleEngine: MangleEngine, files: ManglerFile[]): ManglerFile[] {
    return mangleEngine(
      files,
      this.expressions,
      this.patterns,
      {
        reservedNames: this.reserved,
        manglePrefix: this.prefix,
      },
    );
  }
}
