import type { MangleExpressionOptions } from "@webmangler/types";

import { getCharacterSet } from "./characters";
import {
  getAttributeExpressionOptions,
  getAttributeSelectorExpressionOptions,
  getAttributeUsageExpressionFactory,
} from "./language-options";
import { getIgnorePatterns, getPatterns } from "./patterns";
import { getPrefix } from "./prefix";
import { getReserved } from "./reserved";

/**
 * Get all language options.
 *
 * @returns The language options.
 */
function getLanguageOptions(): Iterable<MangleExpressionOptions<unknown>> {
  return [
    getAttributeExpressionOptions(),
    getAttributeSelectorExpressionOptions(),
    getAttributeUsageExpressionFactory(),
  ];
}

export {
  getCharacterSet,
  getIgnorePatterns,
  getLanguageOptions,
  getPatterns,
  getPrefix,
  getReserved,
};
