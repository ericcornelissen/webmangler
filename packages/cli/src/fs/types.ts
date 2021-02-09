import type { ManglerFile } from "webmangler";

/**
 * The _WebMangler_ CLI representation of a File. It extends the {@link
 * ManglerFile} type with a field recording the file path.
 *
 * @since v0.1.0
 */
interface WebManglerCliFile extends ManglerFile {
  /**
   * The original file size in bytes.
   *
   * NOTE: This is needed because _WebMangler_ changes content in place.
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
   * Get (current) the file size in bytes.
   *
   * @returns The file size in bytes.
   * @since v0.1.2
   */
  readonly size: number;
}

export type { WebManglerCliFile };
