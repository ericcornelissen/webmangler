import type { CssClassManglerOptions } from "../types";

/**
 * The list of reserved strings that are always reserved because they are
 * illegal class names.
 */
const ALWAYS_RESERVED: string[] = [
  /(-|[0-9]).*/.source,
];

/**
 * The default reserved names used by a {@link CssClassMangler}.
 */
const DEFAULT_RESERVED: string[] = [
  // No class names are reserved by default.
];

/**
 * The options for getting the {@link CssClassMangler} reserved class names.
 */
type ReservedOptions = Pick<
  CssClassManglerOptions,
  "reservedClassNames"
>;

/**
 * Get either the configured reserved names or the default reserved names.
 *
 * @param options The {@link ReservedOptions}.
 * @param options.reservedClassNames The configured reserved names.
 * @returns The reserved names to be used.
 */
function getReserved({
  reservedClassNames,
}: ReservedOptions): Iterable<string> {
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
