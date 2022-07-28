/**
 * Convert a mapping from stings to numbers into an ordered list of strings
 * based on the number that string maps to.
 *
 * @param map The map to convert.
 * @returns The ordered list of the `map`.
 * @since v0.1.25
 */
function mapToOrderedList(map: ReadonlyMap<string, number>): string[] {
  const entries = Array.from(map.entries());
  const orderedEntries = entries.sort((a, b) => b[1] - a[1]);
  const orderedInstances = orderedEntries.map((entry) => entry[0]);
  return orderedInstances;
}

/**
 * Remove keys from a map based on any number of patterns.
 *
 * @param originalMap The map to remove keys from.
 * @param removePatterns The patterns of keys to remove.
 * @returns A pruned version of `originalMap` with keys removed.
 * @since v0.1.25
 */
function removeIgnoredKeys(
  originalMap: ReadonlyMap<string, number>,
  removePatterns: Iterable<string>,
): ReadonlyMap<string, number> {
  const prunedMap: Map<string, number> = new Map();
  originalMap.forEach((value, key) => {
    for (const removePattern of removePatterns) {
      const ignoreExpr = new RegExp(removePattern);
      if (ignoreExpr.test(key)) {
        return;
      }
    }

    prunedMap.set(key, value);
  });

  return prunedMap;
}

export {
  mapToOrderedList,
  removeIgnoredKeys,
};
