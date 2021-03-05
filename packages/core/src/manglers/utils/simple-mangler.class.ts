import type { CharSet } from "../../characters";
import type {
  MangleOptions,
  MangleExpressionOptions,
  WebManglerPlugin,
} from "../../types";

/**
 * Interface defining the configuration of a {@link SimpleLanguagePlugin}.
 *
 * @since v0.1.0
 * @version v0.1.14
 */
export interface SimpleManglerOptions {
  /**
   * The character set to use when mangling.
   *
   * @since v0.1.7
   */
  charSet: CharSet;

  /**
   * The {@link MangleExpressionOptions} to use when mangling.
   *
   * @since v0.1.14
   */
  expressionOptions: MangleExpressionOptions<unknown>[];

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
 * a {@link WebManglerPlugin} that deals with implementing the API if it is
 * provided with the appropriate data.
 *
 * It is recommended to extend this class - or {@link MultiMangler}, depending
 * on your needs - if you're implementing a {@link WebManglerPlugin}.
 *
 * @since v0.1.0
 * @version v0.1.15
 */
export default abstract class SimpleManglerPlugin implements WebManglerPlugin {
  /**
   * The character set to use when mangling.
   */
  private readonly charSet: CharSet;

  /**
   * The {@link MangleExpressionOptions} for mangling.
   */
  private readonly expressionOptions: MangleExpressionOptions<unknown>[];

  /**
   * The pattern(s) to be mangled.
   */
  private readonly patterns: string | string[];

  /**
   * The prefix to be used by this mangler.
   */
  private readonly prefix: string;

  /**
   * The reserved names not to be used by this mangler.
   */
  private readonly reserved: string[];

  /**
   * Initialize a new {@link WebManglerPlugin}.
   *
   * @param options The {@link SimpleManglerOptions} (previously `id`).
   * @param oldOptions The old `options` paramter.
   * @deprecated `oldOptions` will be removed, `options` will only be object.
   */
  constructor(
    options: string | SimpleManglerOptions,
    oldOptions?: SimpleManglerOptions,
  ) {
    if (typeof options === "string") {
      options = oldOptions as SimpleManglerOptions;
    }

    this.charSet = options.charSet;
    this.expressionOptions = options.expressionOptions;
    this.patterns = options.patterns;
    this.prefix = options.prefix;
    this.reserved = options.reserved;
  }

  /**
   * @inheritDoc
   * @since v0.1.14
   */
  options(): MangleOptions {
    return {
      charSet: this.charSet,
      expressionOptions: this.expressionOptions,
      manglePrefix: this.prefix,
      patterns: this.patterns,
      reservedNames: this.reserved,
    };
  }
}
