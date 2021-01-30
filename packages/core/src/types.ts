import type { MangleEngineOptions } from "./engine";
import type { ManglerExpression, WebManglerLanguagePlugin } from "./languages";
import type { WebManglerPlugin } from "./manglers";

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
 * Type defining the information required by _WebMangler_ about files.
 *
 * NOTE: The _WebMangler_ core **will not** read or write files for you.
 */
interface ManglerFile {
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
 */
type MangleEngine = (
  files: ManglerFile[],
  expressions: Map<string, ManglerExpression[]>,
  patterns: string | string[],
  options: MangleEngineOptions,
) => ManglerFile[];

export type {
  MangleEngine,
  MangleEngineOptions,
  ManglerFile,
  WebManglerOptions,
};
