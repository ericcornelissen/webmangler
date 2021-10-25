import type {
  MangleEngineOptions,
  MangleExpression,
  WebManglerFile,
} from "@webmangler/types";

import { countInstances } from "./find";
import { removeIgnoredKeys } from "./helpers";
import { getMangleMap } from "./mangle";
import { parseOptions } from "./options";
import { doMangle } from "./replace";

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
 * @version v0.1.23
 */
function mangle<Files extends Iterable<WebManglerFile>>(
  files: Files,
  expressions: Map<string, Iterable<MangleExpression>>,
  options: MangleEngineOptions,
): Files {
  const {
    patterns,
    ignorePatterns,
    manglePrefix,
    reservedNames,
    charSet,
  } = parseOptions(options);

  let instancesCount = countInstances(files, expressions, patterns);
  instancesCount = removeIgnoredKeys(instancesCount, ignorePatterns);

  const mangleMap = getMangleMap(
    instancesCount,
    manglePrefix,
    reservedNames,
    charSet,
  );

  return doMangle(files, expressions, mangleMap);
}

export default mangle;
