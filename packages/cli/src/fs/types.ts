import type { ManglerFile } from "webmangler";

/**
 * The _WebMangler_ CLI representation of a File. It extends the {@link
 * ManglerFile} type with a additional fields used by the CLI.
 *
 * @since v0.1.0
 */
interface WebManglerCliFile extends ManglerFile {
  /**
   * The original file size in bytes.
   *
   * NOTE: This is needed because _WebMangler_ changes content in place and we
   * need to know the original file size to be able to compare it to the mangled
   * file size.
   *
   * @since v0.1.2
   */
  readonly originalSize: number;

  /**
   * The (absolute) path of the file.
   *
   * @since v0.1.0
   */
  readonly path: string;

  /**
   * Get the (current) file size in bytes.
   *
   * @returns The file size in bytes.
   * @since v0.1.2
   */
  readonly size: number;
}

export type { WebManglerCliFile };
