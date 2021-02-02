import type { ManglerFile } from "webmangler";

/**
 * The _WebMangler_ CLI arguments represented as an object.
 *
 * @since v0.1.0
 */
type WebManglerCliArgs = {
  /**
   * Positional arguments from the CLI. These will be interpreted as file globs.
   *
   * @since v0.1.0
   */
  readonly _: string[];

  /**
   * Option to specify the location of the configuration file.
   *
   * @since v0.1.0
   */
  readonly config?: string;

  /**
   * Option to enable writing changes to the input files.
   *
   * @since v0.1.0
   */
  readonly write?: boolean;
}

/**
 * The _WebMangler_ CLI representation of a File. It extends the {@link
 * ManglerFile} type with a field recording the file path.
 *
 * @since v0.1.0
 */
interface WebManglerCliFile extends ManglerFile {
  /**
   * The (absolute) path of the file.
   *
   * @since v0.1.0
   */
  readonly path: string;
}

export type {
  WebManglerCliArgs,
  WebManglerCliFile,
};
