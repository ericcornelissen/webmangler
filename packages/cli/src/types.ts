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

export type { WebManglerCliArgs };
