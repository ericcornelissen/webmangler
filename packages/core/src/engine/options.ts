import type { CharSet, MangleEngineOptions } from "@webmangler/types";

import { ALL_LOWERCASE_CHARS } from "../characters";
import { toArrayIfNeeded } from "../helpers";

const DEFAULT_CHAR_SET = ALL_LOWERCASE_CHARS;
const DEFAULT_IGNORE_PATTERNS: string[] = [];
const DEFAULT_MANGLE_PREFIX = "";
const DEFAULT_RESERVED_NAMES: string[] = [];

/**
 * Parse all values of {@link MangleEngineOptions} into either the configured or
 * the default value.
 *
 * @param options The {@link MangleEngineOptions}.
 * @returns All {@link MangleEngineOptions} values.
 * @since v0.1.25
 */
function parseOptions(options: MangleEngineOptions): {
  patterns: Iterable<string>;
  ignorePatterns: Iterable<string>;
  charSet: CharSet;
  manglePrefix: string;
  reservedNames: Iterable<string>;
} {
  return {
    patterns: toArrayIfNeeded(options.patterns),
    ignorePatterns: options.ignorePatterns ?
      toArrayIfNeeded(options.ignorePatterns) : DEFAULT_IGNORE_PATTERNS,
    charSet: options.charSet || DEFAULT_CHAR_SET,
    manglePrefix: options.manglePrefix || DEFAULT_MANGLE_PREFIX,
    reservedNames: options.reservedNames || DEFAULT_RESERVED_NAMES,
  };
}

export {
  parseOptions,
};
