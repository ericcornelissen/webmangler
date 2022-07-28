import type {
  CharSet,
  MangleExpression,
  WebManglerFile,
} from "@webmangler/types";

import NameGenerator from "../name-generator.class";

/**
 * The {@link CharSet} used to generate unique identifiers for embed locations.
 */
const charSet: CharSet = [
  "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o",
  "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D",
  "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S",
  "T", "U", "V", "W", "X", "Y", "Z", "0", "1", "2", "3", "4", "5", "6", "7",
  "8", "9",
];

/**
 * Convert a direct mapping from input to mangled output into a safe, two-step
 * mangling that prevents problems due to double mangling.
 *
 * @param mangleMap The mapping defining a direct mangling from input to output.
 * @returns A two-step mapping defining the mangling from input to output.
 */
function getSafeTwoStepMangleMapping(
  mangleMap: ReadonlyMap<string, string>,
): [Map<string, string>, Map<string, string>] {
  const reservedNames = mangleMap.values();
  const uniqueNameGenerator = new NameGenerator({ charSet, reservedNames });

  const map1 = new Map();
  const map2 = new Map();
  mangleMap.forEach((mangledName, originalName) => {
    // Filter out ineffective mappings
    if (mangledName === originalName) {
      return;
    }

    if (mangleMap.has(mangledName)) {
      // Use an intermediate mangling value when mangling if the mangled value
      // could be re-mangled be another mapping.
      const uniqueName = uniqueNameGenerator.nextName();
      map1.set(originalName, uniqueName);
      map2.set(uniqueName, mangledName);
    } else {
      // Just mangle if the mangled name does not appear in the mangle map and
      // therefore cannot be re-mangled.
      map1.set(originalName, mangledName);
    }
  });

  return [map1, map2];
}

/**
 * Mangle a set of files based on a specified mapping of string to mangle. In
 * effect, this is just an advanced search-and-replace over multiple files.
 * It searches for keys of `mangleMap` based on the provided `expressions` and
 * replaces them by the respective value in the `mangleMap`.
 *
 * NOTE: this function assumes all files are supported by the `expressions`.
 *
 * @param files The files to mangle.
 * @param expressions The {@link MangleExpression}s to base the mangling on.
 * @param mangleMap The mapping defining the mangling.
 * @returns The mangled files.
 * @since v0.1.25
 */
function doMangle<Files extends Iterable<WebManglerFile>>(
  files: Files,
  expressions: ReadonlyMap<string, Iterable<MangleExpression>>,
  mangleMap: ReadonlyMap<string, string>,
): Files {
  const [map1, map2] = getSafeTwoStepMangleMapping(mangleMap);
  for (const file of files) {
    const fileExpressions = expressions.get(file.type) || [];
    for (const expression of fileExpressions) {
      file.content = expression.replaceAll(file.content, map1);
      file.content = expression.replaceAll(file.content, map2);
    }
  }

  return files;
}

export {
  getSafeTwoStepMangleMapping,
  doMangle,
};
