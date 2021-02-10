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
type ManglerStats = Map<string, FileStats>;

type SimpleLogger = (msg: string) => void;

export type {
  FileStats,
  ManglerStats,
  SimpleLogger,
};
