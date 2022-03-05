/**
 * Statistics about an individually mangled file.
 */
type FileStats = {
  /**
   * Did the file size change.
   */
  readonly changed: boolean;

  /**
   * The amount of change as a percentage.
   */
  readonly changePercentage: number;

  /**
   * The file size before mangling.
   */
  readonly sizeBefore: number;

  /**
   * The file size after mangling.
   */
  readonly sizeAfter: number;
}

/**
 * Statistics about a _WebMangler_ run.
 */
interface ManglerStats {
  /**
   * The aggregate {@link FileStats} over all files.
   */
  readonly aggregate: FileStats;

  /**
   * The time it took to mangle.
   */
  readonly duration: number;

  /**
   * The {@link FileStats} for every mangled file.
   */
  readonly files: Map<string, FileStats>;
}

export type {
  FileStats,
  ManglerStats,
};
