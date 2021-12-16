import type { MangleExpressionOptions } from "@webmangler/types";
import type {
  IdAttributeExpressionOptions,
  UrlAttributeExpressionOptions,
} from "./language-options";

import { getCharacterSet } from "./characters";
import {
  getIdAttributeExpressionOptions,
  getQuerySelectorExpressionOptions,
  getUrlAttributeExpressionOptions,
} from "./language-options";
import { getIgnorePatterns, getPatterns } from "./patterns";
import { getPrefix } from "./prefix";
import { getReserved } from "./reserved";

/**
 * The options for building the language options for a {@link HtmlIdMangler}.
 */
type LanguageOptionsOptions = IdAttributeExpressionOptions
  & UrlAttributeExpressionOptions;

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
    getIdAttributeExpressionOptions(options),
    getQuerySelectorExpressionOptions(),
    getUrlAttributeExpressionOptions(options),
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
