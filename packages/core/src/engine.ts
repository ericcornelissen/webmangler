import type { CharSet } from "./characters";
import type {
  MangleEngineOptions,
  MangleExpression,
  WebManglerFile,
} from "./types";

import { ALL_LOWERCASE_CHARS } from "./characters";
import { toArrayIfNeeded } from "./helpers";
import NameGenerator from "./name-generator.class";

const DEFAULT_CHAR_SET = ALL_LOWERCASE_CHARS;
const DEFAULT_MANGLE_PREFIX = "";
const DEFAULT_RESERVED_NAMES: string[] = [];

/**
 * Convert a mapping from stings to numbers into an ordered list of strings
 * based on the number that string maps to.
 *
 * @param map The map to convert.
 * @returns The ordered list of the `map`.
 */
function mapToOrderedList(map: Map<string, number>): string[] {
  const entries = Array.from(map.entries());
  const orderedEntries = entries.sort((a, b) => b[1] - a[1]);
  const orderedInstances = orderedEntries.map((entry) => entry[0]);
  return orderedInstances;
}

/**
 * Count the number of instances of each string matching `expressions` and
 * `patterns` in the provided `files`.
 *
 * @param files The files to be mangled.
 * @param expressions The {@link MangleExpression}s to base the mangling on.
 * @param patterns The patterns of strings to mangle.
 * @returns A map of the count of each string matching a `pattern`.
 */
function countInstances(
  files: Iterable<WebManglerFile>,
  expressions: Map<string, Iterable<MangleExpression>>,
  patterns: Iterable<string>,
): Map<string, number> {
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
 */
function getMangleMap(
  instances: Map<string, number>,
  manglePrefix: string,
  reservedNames: Iterable<string>,
  charSet: CharSet,
): Map<string, string> {
  const orderedInstances = mapToOrderedList(instances);
  const mangleMap: Map<string, string> = new Map();

  const nameGenerator = new NameGenerator(reservedNames, charSet);
  orderedInstances.forEach((originalName: string): void => {
    const mangleName = nameGenerator.nextName();
    const fullMangledName = `${manglePrefix}${mangleName}`;
    mangleMap.set(originalName, fullMangledName);
  });

  return mangleMap;
}

/**
 * Convert a direct mapping from input to mangled output into a safe, two-step
 * mangling that prevents problems due to double mangling.
 *
 * @param mangleMap The mapping defining a direct mangling from input to output.
 * @returns A two-step mapping defining the mangling from input to output.
 */
function getSafeTwoStepMangleMapping(
  mangleMap: Map<string, string>,
): [Map<string, string>, Map<string, string>] {
  const mangleOutStrings = Array.from(mangleMap.values());
  const uniqueNameGenerator = new NameGenerator(mangleOutStrings);

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
 */
function doMangle<Files extends Iterable<WebManglerFile>>(
  files: Files,
  expressions: Map<string, Iterable<MangleExpression>>,
  mangleMap: Map<string, string>,
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

/**
 * Parse all values of {@link MangleEngineOptions} into either the configured or
 * the default value.
 *
 * @param options The {@link MangleEngineOptions}.
 * @returns All {@link MangleEngineOptions} values.
 */
function parseOptions(options: MangleEngineOptions): {
  patterns: Iterable<string>,
  charSet: CharSet,
  manglePrefix: string,
  reservedNames: Iterable<string>,
} {
  return {
    patterns: toArrayIfNeeded(options.patterns),
    charSet: options.charSet || DEFAULT_CHAR_SET,
    manglePrefix: options.manglePrefix || DEFAULT_MANGLE_PREFIX,
    reservedNames: options.reservedNames || DEFAULT_RESERVED_NAMES,
  };
}

/**
 * Mangle all strings matching the provided `expressions` and `patterns`
 * consistently across all `files`.
 *
 * The names and patterns in `reservedNames` specified in the `options` will not
 * be outputted as mangled strings. By default no strings are reserved.
 *
 * The `manglePrefix` specified in the `options` will be used as a prefix for
 * all mangled strings. By default no prefix is used.
 *
 * @param files The files to mangle.
 * @param expressions The {@link MangleExpression}s to mangle based on.
 * @param options The configuration for mangling.
 * @returns The mangled files.
 * @since v0.1.0
 * @version v0.1.21
 */
export default function mangle<Files extends Iterable<WebManglerFile>>(
  files: Files,
  expressions: Map<string, Iterable<MangleExpression>>,
  options: MangleEngineOptions,
): Files {
  const {
    patterns,
    manglePrefix,
    reservedNames,
    charSet,
  } = parseOptions(options);

  const instancesCount = countInstances(files, expressions, patterns);
  const mangleMap = getMangleMap(
    instancesCount,
    manglePrefix,
    reservedNames,
    charSet,
  );

  return doMangle(files, expressions, mangleMap);
}
