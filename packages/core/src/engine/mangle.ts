import type { CharSet } from "@webmangler/types";

import NameGenerator from "../name-generator.class";
import { mapToOrderedList } from "./helpers";

/**
 * Convert a list of strings to mangle (including the number of times they
 * will be replaced) into an unsafe mapping that defines a mangling.
 *
 * The mapping produces by this function is unsafe in the sense that a value `v`
 * in the map may also appear as a key `k` in the map. If this happens, the
 * value `v` may be ultimately be mangled into the value of `k`.
 *
 * @param instances The strings to mangle and the number of times they appear.
 * @param manglePrefix The prefix for mangled values.
 * @param reservedNames Strings and patterns not to be used as mangled strings.
 * @param charSet The character set to use to generate mangle strings.
 * @returns A mapping defining the mangling.
 * @since v0.1.25
 */
function getMangleMap(
  instances: ReadonlyMap<string, number>,
  manglePrefix: string,
  reservedNames: Iterable<string>,
  charSet: CharSet,
): ReadonlyMap<string, string> {
  const orderedInstances = mapToOrderedList(instances);
  const mangleMap: Map<string, string> = new Map();

  const nameGenerator = new NameGenerator({ reservedNames, charSet });
  orderedInstances.forEach((originalName: string): void => {
    const mangleName = nameGenerator.nextName();
    const fullMangledName = `${manglePrefix}${mangleName}`;
    mangleMap.set(originalName, fullMangledName);
  });

  return mangleMap;
}

export {
  getMangleMap,
};
