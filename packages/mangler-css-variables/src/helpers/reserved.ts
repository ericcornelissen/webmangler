/**
 * The list of reserved strings that are always reserved because they are
 * illegal CSS variable names.
 */
const ALWAYS_RESERVED: string[] = [
  /[-0-9].*/.source,
];

/**
 * The default reserved names used by a {@link CssVariableMangler}.
 */
const DEFAULT_RESERVED: string[] = [
  // No variable names are reserved by default.
];

/**
 * The options for CSS variable mangler reserved names.
 */
interface ReservedOptions {
  /**
   * A list of strings and patterns of CSS variable names that should not be
   * used, if any.
   */
  readonly reservedCssVarNames?: Iterable<string>;
}

/**
 * Get either the configured reserved names or the default reserved names.
 *
 * @param options The {@link ReservedOptions}.
 * @param options.reservedCssVarNames The configured reserved names.
 * @returns The reserved names to be used.
 */
function getReserved({
  reservedCssVarNames,
}: ReservedOptions): Iterable<string> {
  let configured = reservedCssVarNames;
  if (configured === undefined) {
    configured = DEFAULT_RESERVED;
  }

  return new Set([
    ...ALWAYS_RESERVED,
    ...configured,
  ]);
}

export {
  getReserved,
};
