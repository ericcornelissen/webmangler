import type { ManglerExpression, WebManglerLanguagePlugin } from "./languages";

/**
 * A character is an one of a selection of strings of length one.
 *
 * @since v0.1.7
 */
type Char =
  "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" | "j" | "k" | "l" | "m" |
  "n" | "o" | "p" | "q" | "r" | "s" | "t" | "u" | "v" | "w" | "x" | "y" | "z" |
  "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L" | "M" |
  "N" | "O" | "P" | "Q" | "R" | "S" | "T" | "U" | "V" | "W" | "X" | "Y" | "Z" |
  "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "-" | "_";

/**
 * A character set is an ordered list of {@link Char}acters.
 *
 * @since v0.1.7
 */
type CharSet = Char[];

/**
 * Type defining the available options for _WebMangler_.
 *
 * @since v0.1.0
 */
interface WebManglerOptions {
  /**
   * The plugins to be used by the _WebMangler_.
   *
   * @since v0.1.0
   */
  plugins: WebManglerPlugin[];

  /**
   * The plugins of language to support.
   *
   * @since v0.1.0
   */
  languages: WebManglerLanguagePlugin[];
}

/**
 * The interface that every plugin for _WebMangler_ must implement.
 *
 * @since v0.1.0
 * @version v0.1.11
 */
interface WebManglerPlugin {
  /**
   * Get the plugin's configuration for {@link MangleEngine}.
   *
   * @returns The {@link MangleEngineOptions}.
   * @since v0.1.11
   */
  config(): MangleEngineOptions | MangleEngineOptions[];

  /**
   * Mangle a set of `files` with this {@link WebManglerPlugin}.
   *
   * It is recommended for the plugin to use the `mangleEngine` to do the
   * mangling.
   *
   * @param mangleEngine The _WebMangler_ core mangling engine.
   * @param files The files to be mangled.
   * @returns The mangled files.
   * @since v0.1.0
   * @deprecated
   */
  mangle<File extends WebManglerFile>(
    mangleEngine: MangleEngine<File>,
    files: File[],
  ): File[];

  /**
   * Instruct the {@link WebManglerPlugin} to use the {@link ManglerExpression}s
   * specified by a {@link WebManglerLanguagePlugin}.
   *
   * @param languagePlugin The {@link WebManglerLanguagePlugin} to be used.
   * @since v0.1.0
   */
  use(languagePlugin: WebManglerLanguagePlugin): void;
}

/**
 * Type defining the information required by _WebMangler_ about files.
 *
 * NOTE: The _WebMangler_ core **will not** read or write files for you.
 *
 * @since v0.1.0
 */
interface WebManglerFile {
  /**
   * The contents of the file as a string.
   *
   * @since v0.1.0
   */
  content: string;

  /**
   * The type of file, e.g. "js" or "html".
   *
   * This can typically be obtained by looking at the extension of the file.
   *
   * @since v0.1.0
   */
  readonly type: string;
}

/**
 * Type defining a {@link MangleEngine}, which is a function that performs the
 * search-and-replace part of mangling.
 *
 * NOTE: a {@link MangleEngine} may return fewer files that it was provided
 * with.
 *
 * @param files The files that should be mangled.
 * @param expressions The {@link ManglerExpression}s to find strings to mangle.
 * @param patterns The patterns of string to be mangled.
 * @param options The configuration for mangling.
 * @returns The mangled files.
 * @since v0.1.0
 * @deprecated
 */
type MangleEngine<File extends WebManglerFile> = (
  files: File[],
  expressions: Map<string, ManglerExpression[]>,
  patterns: string | string[],
  options: {
    /**
     * The character set for mangled strings.
     *
     * @default {@link NameGenerator.DEFAULT_CHARSET}
     * @since v0.1.7
     */
    readonly charSet?: CharSet;

    /**
     * The prefix to use for mangled strings.
     *
     * @default `""`
     * @since v0.1.0
     */
    manglePrefix?: string;

    /**
     * A list of names and patterns not to be used as mangled string.
     *
     * Patterns are supported since v0.1.7.
     *
     * @default `[]`
     * @since v0.1.0
     */
    reservedNames?: string[];
  },
) => File[];

/**
 * A set of generic options used by the {@link MangleEngine} for mangling.
 *
 * @since v0.1.0
 * @version v0.1.11
 */
type MangleEngineOptions = {
  /**
   *The {@link ManglerExpression}s to find strings to mangle.
   *
   * @since v0.1.11
   */
  readonly expressions: Map<string, ManglerExpression[]>;

  /**
   * The pattern(s) to be mangled.
   *
   * @since v0.1.11
   */
  readonly patterns: string | string[];

  /**
   * The character set for mangled strings.
   *
   * @default {@link NameGenerator.DEFAULT_CHARSET}
   * @since v0.1.7
   */
  readonly charSet?: CharSet;

  /**
   * The prefix to use for mangled strings.
   *
   * @default `""`
   * @since v0.1.0
   */
  manglePrefix?: string;

  /**
   * A list of names and patterns not to be used as mangled string.
   *
   * Patterns are supported since v0.1.7.
   *
   * @default `[]`
   * @since v0.1.0
   */
  reservedNames?: string[];
}

export type {
  Char,
  CharSet,
  MangleEngine,
  MangleEngineOptions,
  WebManglerFile,
  WebManglerOptions,
  WebManglerPlugin,
};
