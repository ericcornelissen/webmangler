import type { MangleExpression } from "@webmangler/types";
import type { QuerySelectorOptions } from "../options";

import { SingleGroupMangleExpression } from "@webmangler/language-utils";
import { patterns } from "./common";

const GROUP_MAIN = "main";

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
    new SingleGroupMangleExpression(
      `
        (?:
          (?:${patterns.anyString}|${patterns.comment})
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
          (?<${GROUP_MAIN}>%s)
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
      GROUP_MAIN,
    ),
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
 * @version v0.1.22
 */
export default function querySelectorExpressionFactory(
  options: QuerySelectorOptions,
): Iterable<MangleExpression> {
  return [
    ...newCssSelectorExpression(options.prefix, options.suffix),
  ];
}
