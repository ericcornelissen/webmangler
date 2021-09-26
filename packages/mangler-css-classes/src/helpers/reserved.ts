/**
 * The list of reserved strings that are always reserved because they are
 * illegal class names.
 */
const ALWAYS_RESERVED: string[] = [
  "(-|[0-9]).*",
];

/**
 * The default reserved names used by a {@link CssClassMangler}.
 */
const DEFAULT_RESERVED: string[] = [
  // No class names are reserved by default.
];

/**
 * Get either the configured reserved names or the default reserved names.
 *
 * @param reservedClassNames The configured reserved names.
 * @returns The reserved names to be used.
 */
function getReserved(
  reservedClassNames?: Iterable<string>,
): Iterable<string> {
  let configured = reservedClassNames;
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
