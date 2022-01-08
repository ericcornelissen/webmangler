import type { WebManglerCliFile } from "./types";

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
 * The default implementation of {@link WebManglerCliFile}.
 *
 * @since v0.1.0
 */
class DefaultWebManglerCliFile implements WebManglerCliFile {
  /**
   * @inheritDoc
   */
  public content: string;

  /**
   * @inheritDoc
   */
  public readonly originalSize: number;

  /**
   * @inheritDoc
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
   * @inheritDoc
   */
  get size(): number {
    return this.content.length;
  }
}

export default DefaultWebManglerCliFile;
