import type { MangleExpression, WebManglerFile } from "@webmangler/types";

/**
 * Count the number of instances of each string matching `expressions` and
 * `patterns` in the provided `files`.
 *
 * @param files The files to be mangled.
 * @param expressions The {@link MangleExpression}s to base the mangling on.
 * @param patterns The patterns of strings to mangle.
 * @returns A map of the count of each string matching a `pattern`.
 * @since v0.1.25
 */
function countInstances(
  files: Iterable<WebManglerFile>,
  expressions: ReadonlyMap<string, Iterable<MangleExpression>>,
  patterns: Iterable<string>,
): ReadonlyMap<string, number> {
  const countMap: Map<string, number> = new Map();
  for (const file of files) {
    const fileExpressions = expressions.get(file.type) || [];
    for (const pattern of patterns) {
      for (const expression of fileExpressions) {
        for (const name of expression.findAll(file.content, pattern)) {
          const count = countMap.get(name) || 0;
          countMap.set(name, count + 1);
        }
      }
    }
  }

  return countMap;
}

export {
  countInstances,
};
