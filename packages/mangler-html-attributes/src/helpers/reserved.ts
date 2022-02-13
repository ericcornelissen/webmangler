/**
 * The list of reserved strings that are always reserved because they are
 * illegal HTML attribute names.
 */
const ALWAYS_RESERVED: string[] = [
  "([0-9]|-|_).*",
];

/**
 * The default reserved names used by a {@link HtmlAttributeMangler}.
 */
const DEFAULT_RESERVED: string[] = [
  // No attribute names are reserved by default.
];

/**
 * The options for HTML attribute mangler reserved names.
 */
interface ReservedOptions {
  /**
   * A list of strings and patterns of HTML attributes names that should not be
   * used, if any.
   */
  readonly reservedAttrNames?: Iterable<string>;
}

/**
 * Get either the configured reserved names or the default reserved names.
 *
 * @param options The {@link ReservedOptions}.
 * @param options.reservedAttrNames The configured reserved names.
 * @returns The reserved names to be used.
 */
function getReserved({
  reservedAttrNames,
}: ReservedOptions): Iterable<string> {
  let configured = reservedAttrNames;
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
