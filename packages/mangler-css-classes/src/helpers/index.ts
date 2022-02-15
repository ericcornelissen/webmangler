import type { MangleExpressionOptions } from "@webmangler/types";

import type { ClassAttributeExpressionOptions } from "./language-options";

import { getCharacterSet } from "./characters";
import {
  getClassAttributeExpressionOptions,
  getQuerySelectorExpressionOptions,
} from "./language-options";
import { getIgnorePatterns, getPatterns } from "./patterns";
import { getPrefix } from "./prefix";
import { getReserved } from "./reserved";

/**
 * The options for building the language options for a {@link CssClassMangler}.
 */
type LanguageOptionsOptions = ClassAttributeExpressionOptions;

/**
 * Get all language options.
 *
 * @param options The {@link LanguageOptionsOptions}.
 * @returns The language options.
 */
function getLanguageOptions(
  options: LanguageOptionsOptions,
): Iterable<MangleExpressionOptions<unknown>> {
  return [
    getQuerySelectorExpressionOptions(),
    getClassAttributeExpressionOptions(options),
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
