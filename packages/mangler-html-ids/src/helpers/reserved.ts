/**
 * The list of reserved strings that are always reserved because they are
 * illegal HTML id names.
 */
const ALWAYS_RESERVED: Iterable<string> = [
  // No id names are always reserved.
];

/**
 * The default reserved names used by a {@link HtmlIdMangler}.
 */
const DEFAULT_RESERVED: Iterable<string> = [
  // No id names are reserved by default.
];

/**
 * The options for HTML id mangler reserved names.
 */
interface ReservedOptions {
  /**
   * A list of strings and patterns of HTML id names that should not be
   * used, if any.
   */
  readonly reservedIds?: Iterable<string>;
}

/**
 * Get either the configured reserved names or the default reserved names.
 *
 * @param options The {@link ReservedOptions}.
 * @param options.reservedIds The configured reserved names.
 * @returns The reserved names to be used.
 */
function getReserved({
  reservedIds,
}: ReservedOptions): Iterable<string> {
  let configured = reservedIds;
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
