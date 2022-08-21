import type {
  MangleExpression,
  QuerySelectorOptions,
} from "@webmangler/types";

import { SingleGroupMangleExpression } from "@webmangler/language-utils";
import { patterns } from "./common";

/**
 * Get a {@link MangleExpression} to match query selectors in CSS, e.g. `foobar`
 * in `.foobar { }`.
 *
 * @param [selectorPrefix] The query selector prefix.
 * @param [selectorSuffix] The query selector suffix.
 * @returns The {@link MangleExpression}s to match query selectors in CSS.
 */
function newCssSelectorExpression(
  selectorPrefix?: string,
  selectorSuffix?: string,
): Iterable<MangleExpression> {
  return [
    new SingleGroupMangleExpression({
      patternTemplate: `
        (?:
          (?:${patterns.anyString}|${patterns.comment}|${patterns.ruleset})
          |
          (?<=
            ${selectorPrefix ? selectorPrefix : `
              (?:
                ^|\\}|
                ${patterns.allowedBeforeSelector}|
                ${patterns.commentClose}
              )
            `}
          )
          ${SingleGroupMangleExpression.CAPTURE_GROUP}
          (?=
            ${selectorSuffix ? selectorSuffix : `
              (?:
                $|\\{|
                ${patterns.allowedAfterSelector}|
                ${patterns.commentOpen}
              )
            `}
          )
        )
      `,
    }),
  ];
}

/**
 * Get the set of {@link MangleExpression}s to match CSS selectors in CSS. This
 * will match:
 * - CSS selectors (e.g. `foobar` in `.foobar { }`).
 *
 * @param options The {@link QuerySelectorOptions}.
 * @returns A set of {@link MangleExpression}s.
 * @since v0.1.14
 * @version v0.1.29
 */
function querySelectorExpressionFactory(
  options: QuerySelectorOptions,
): Iterable<MangleExpression> {
  return [
    ...newCssSelectorExpression(options.prefix, options.suffix),
  ];
}

export default querySelectorExpressionFactory;
