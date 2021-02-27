import type { CharSet } from "../../characters";
import type {
  MangleOptions,
  MangleEngineOptions,
  MangleExpressionOptions,
  WebManglerPlugin,
} from "../../types";

/**
 * Interface defining the configuration of a {@link SimpleLanguagePlugin}.
 *
 * @since v0.1.0
 * @version v0.1.14
 */
interface SimpleManglerOptions {
  /**
   * The character set to use when mangling.
   *
   * @since v0.1.7
   */
  charSet: CharSet;

  /**
   * TODO.
   *
   * @since v0.1.14
   */
  expressions: MangleExpressionOptions[];

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
 * @version v0.1.14
 */
export default abstract class SimpleManglerPlugin implements WebManglerPlugin {
  /**
   * The identifier of the {@link WebManglerPlugin}.
   */
  private readonly id: string;

  /**
   * The character set to use when mangling.
   */
  private readonly charSet: CharSet;

  /**
   * TODO.
   */
  private readonly expressions: MangleExpressionOptions[];

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
   * @param id The identifier for the {@link WebManglerPlugin}.
   * @param options The {@link SimpleManglerOptions}.
   */
  constructor(id: string, options: SimpleManglerOptions) {
    this.id = id;
    this.charSet = options.charSet;
    this.expressions = options.expressions;
    this.patterns = options.patterns;
    this.prefix = options.prefix;
    this.reserved = options.reserved;
  }

  /**
   * @inheritDoc
   * @since v0.1.11
   * @deprecated
   */
  config(): MangleEngineOptions {
    return {
      id: this.id,
      charSet: this.charSet,
      manglePrefix: this.prefix,
      patterns: this.patterns,
      reservedNames: this.reserved,
    };
  }

  /**
   * @inheritDoc
   * @since v0.1.14
   */
  options(): MangleOptions {
    return {
      id: this.id,
      charSet: this.charSet,
      expressions: this.expressions,
      manglePrefix: this.prefix,
      patterns: this.patterns,
      reservedNames: this.reserved,
    };
  }
}
