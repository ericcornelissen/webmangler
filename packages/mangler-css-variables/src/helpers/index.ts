import type { MangleExpressionOptions } from "@webmangler/types";

import {
  getCssVariableDefinitionExpressionOptions,
  getCssVariableUsageExpressionOptions,
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
    getCssVariableDefinitionExpressionOptions(),
    getCssVariableUsageExpressionOptions(),
  ];
}

export {
  getIgnorePatterns,
  getLanguageOptions,
  getPatterns,
  getPrefix,
  getReserved,
};
