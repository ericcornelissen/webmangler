import type { ManglerExpression } from "./languages";
import type { CharSet, ManglerFile } from "./types";

import { toArrayIfNeeded } from "./helpers";
import NameGenerator from "./name-generator.class";

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
 * @param expressions The {@link ManglerExpression}s to base the mangling on.
 * @param patterns The patterns of strings to mangle.
 * @returns A map of the count of each string matching a `pattern`.
 */
function countInstances(
  files: ManglerFile[],
  expressions: Map<string, ManglerExpression[]>,
  patterns: string[],
): Map<string, number> {
  const countMap: Map<string, number> = new Map();
  files.forEach((file: ManglerFile): void => {
    const fileExpressions = expressions.get(file.type) as ManglerExpression[];
    patterns.forEach((pattern: string): void => {
      fileExpressions.forEach((expression: ManglerExpression): void => {
        for (const name of expression.exec(file.content, pattern)) {
          const count = countMap.get(name) || 0;
          countMap.set(name, count + 1);
        }
      });
    });
  });

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
 * @param reservedNames The values not to be used as mangled value.
 * @param charSet The character set to use to generate mangle strings.
 * @returns A mapping defining the mangling.
 */
function mangleInstances(
  instances: Map<string, number>,
  manglePrefix: string,
  reservedNames: string[],
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
 * Convert a direct mapping from input to mangled output into safe, two-step
 * mangling. The first-step map can be used to mangle the input into a state
 * where the second map can be used to safely mangle. For more details see
 * {@link getMangleMaps}.
 *
 * @param mangleMap The mapping defining a direct mangling from input to output.
 * @returns A two-step mapping defining the mangling from input to output.
 */
function getSafeTwoStepMangleMapping(
  mangleMap: Map<string, string>,
): [Map<string, string>, Map<string, string>] {
  const mapToUnique: Map<string, string> = new Map();
  const mapToMangled: Map<string, string> = new Map();

  const nameGenerator = new NameGenerator();
  while (mapToUnique.size !== mangleMap.size) {
    const uniquePrefix = nameGenerator.nextName();
    if (!mangleMap.has(uniquePrefix)) {
      for (const [key, value] of mangleMap) {
        const intermediateValue = `${uniquePrefix}-${value}`;
        if (mangleMap.has(intermediateValue)) {
          mapToUnique.clear();
          mapToMangled.clear();
          break;
        }

        mapToUnique.set(key, intermediateValue);
        mapToMangled.set(intermediateValue, value);
      }
    }
  }

  return [mapToUnique, mapToMangled];
}

/**
 * Convert a list of strings to mangle (including the number of times they
 * will be replaced) into a two-step mapping that defines a mangling.
 *
 * This function produces a pair of two mappings. The first mapping must be used
 * to convert the strings to mangle into unique values that can subsequently be
 * safely mangled using the second mapping. This ensures values mangled are not
 * mangled again by subsequent mappings.
 *
 * @param instances The strings to mangle and the number of times they appear.
 * @param manglePrefix The prefix to be used for mangled values.
 * @param reservedNames The names that should not be used.
 * @param charSet The character set to use to generate mangle strings.
 * @returns Two maps to perform safe two-step mangling.
 */
function getMangleMaps(
  instances: Map<string, number>,
  manglePrefix: string,
  reservedNames: string[],
  charSet: CharSet,
): [Map<string, string>, Map<string, string>] {
  const mangleMap = mangleInstances(
    instances,
    manglePrefix,
    reservedNames,
    charSet,
  );

  return getSafeTwoStepMangleMapping(mangleMap);
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
 * @param expressions The {@link ManglerExpression}s to base the mangling on.
 * @param mangleMap The mapping defining the mangling.
 * @returns The mangled files.
 */
function doMangle<File extends ManglerFile>(
  files: File[],
  expressions: Map<string, ManglerExpression[]>,
  mangleMap: Map<string, string>,
): File[] {
  files.forEach((file) => {
    const fileExpressions = expressions.get(file.type) as ManglerExpression[];
    mangleMap.forEach((to, from) => {
      fileExpressions.forEach((expression) => {
        file.content = expression.replace(file.content, from, to);
      });
    });
  });

  return files;
}

/**
 * Filter out `files` that are not supported for mangling by the mangling
 * `expressions`.
 *
 * @param files The original lit of files.
 * @param expressions The {@link ManglerExpression}s to be used in mangling.
 * @returns The files supported by the `expressions`.
 */
function getSupportedFilesOnly<File extends ManglerFile>(
  files: File[],
  expressions: Map<string, ManglerExpression[]>,
): File[] {
  return files.filter((file) => expressions.get(file.type) !== undefined);
}

/**
 * Parse all values of {@link MangleEngineOptions} into either the configured or
 * the default value.
 *
 * @param options The {@link MangleEngineOptions}.
 * @returns All {@link MangleEngineOptions} values.
 */
function parseOptions(
  options: MangleEngineOptions,
): {
  charSet: CharSet,
  manglePrefix: string,
  reservedNames: string[],
} {
  return {
    charSet: options.charSet || NameGenerator.DEFAULT_CHARSET,
    manglePrefix: options.manglePrefix || DEFAULT_MANGLE_PREFIX,
    reservedNames: options.reservedNames || DEFAULT_RESERVED_NAMES,
  };
}

/**
 * A set of generic options used by the {@link MangleEngine} for mangling.
 *
 * @since v0.1.0
 */
export type MangleEngineOptions = {
  /**
   * The character set for mangled strings.
   *
   * @default {@link NameGenerator.DEFAULT_CHARSET}
   * @since v0.1.7
   */
  readonly charSet?: CharSet;

  /**
   * The prefix to use for mangled strings.
   *
   * @default `""`
   * @since v0.1.0
   */
  manglePrefix?: string;

  /**
   * A list of names not to be used as mangled string.
   *
   * @default `[]`
   * @since v0.1.0
   */
  reservedNames?: string[];
}

/**
 * Mangle all strings matching the provided `expressions` and `patterns`
 * consistently across all `files`.
 *
 * The names in `reservedNames` specified in the `options` will not be outputted
 * as mangled strings. By default no values are reserved.
 *
 * The `manglePrefix` specified in the `options` will be used as a prefix for
 * all mangled values. By default no prefix is used.
 *
 * NOTE: files that are not supported won't be returned. Therefore, the returned
 * list may be shorter than the inputted list.
 *
 * @param files The files to mangle.
 * @param expressions The {@link ManglerExpression}s to find strings to mangle.
 * @param patterns The patterns of strings to mangle.
 * @param options The configuration for mangling.
 * @returns The mangled files.
 * @since v0.1.0
 */
export default function mangle<File extends ManglerFile>(
  files: File[],
  expressions: Map<string, ManglerExpression[]>,
  patterns: string | string[],
  options: MangleEngineOptions,
): File[] {
  const supportedFiles = getSupportedFilesOnly(files, expressions);
  const { manglePrefix, reservedNames, charSet } = parseOptions(options);
  patterns = toArrayIfNeeded(patterns);

  const instancesCount = countInstances(supportedFiles, expressions, patterns);
  const [mapToUnique, mapToMangled] = getMangleMaps(
    instancesCount,
    manglePrefix,
    reservedNames,
    charSet,
  );

  const intermediateFiles = doMangle(supportedFiles, expressions, mapToUnique);
  return doMangle(intermediateFiles, expressions, mapToMangled);
}
