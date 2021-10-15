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
 * Get either the configured reserved names or the default reserved names.
 *
 * @param reservedAttrNames The configured reserved names.
 * @returns The reserved names to be used.
 */
function getReserved(
  reservedAttrNames?: Iterable<string>,
): Iterable<string> {
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
