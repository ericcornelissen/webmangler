import type { ManglerFile } from "webmangler";

import * as path from "path";

/**
 * Get the type from a file path based on its extension.
 *
 * @param filePath The file path of interest.
 * @returns The file type.
 */
function getTypeFromFilePath(filePath: string): string {
  return path.extname(filePath).substring(1);
}

/**
 * Type representing the parameters for the {@link WebManglerCliFile}
 * constructor.
 */
type WebManglerCliFileParams = {
  readonly content: string;
  readonly filePath: string;
}

/**
 * The _WebMangler_ CLI representation of a File. It extends the {@link
 * ManglerFile} type with a field recording the file path.
 *
 * @since v0.1.0
 */
export default class WebManglerCliFile implements ManglerFile {
  /**
   * @inheritDoc
   */
  public content: string;

  /**
   * The original file size in bytes.
   *
   * NOTE: This is needed because _WebMangler_ changes content in place.
   *
   * @since v0.1.0
   */
  public readonly originalSize: number;

  /**
   * The (absolute) path of the file.
   *
   * @since v0.1.0
   */
  public readonly path: string;

  /**
   * @inheritDoc
   */
  public readonly type: string;

  /**
   * Instantiate a new {@link WebManglerCliFile}.
   *
   * @param params The parameters for the new {@link WebManglerCliFile}.
   */
  constructor(params: WebManglerCliFileParams) {
    const { content, filePath } = params;

    this.content = content;
    this.originalSize = this.size;
    this.path = filePath;
    this.type = getTypeFromFilePath(filePath);
  }

  /**
   * Get the file size in bytes.
   *
   * @returns The file size in bytes.
   */
  get size(): number {
    return this.content.length;
  }
}
