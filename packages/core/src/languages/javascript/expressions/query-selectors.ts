import type { MangleExpression } from "../../../types";
import type { QuerySelectorOptions } from "../../options";

import {
  NestedGroupMangleExpression,
  SingleGroupMangleExpression,
} from "@webmangler/language-utils";
import { patterns, QUOTES_ARRAY } from "./common";

const GROUP_MAIN = "main";
const GROUP_QUOTE = "quote";

/**
 * Get {@link MangleExpression}s to match query selectors in JavaScript, e.g.
 * `foobar` in `document.querySelectorAll(".foobar");`.
 *
 * @param [selectorPrefix] The query selector prefix, if any.
 * @param [selectorSuffix] The query selector suffix, if any.
 * @returns The {@link MangleExpression}s to match query selectors in JS.
 */
function newQuerySelectorExpressions(
  selectorPrefix?: string,
  selectorSuffix?: string,
): Iterable<MangleExpression> {
  return QUOTES_ARRAY.map((quote) => new NestedGroupMangleExpression(
    `
      (?:
        (?:${patterns.comment})
        |
        (?<${GROUP_MAIN}>
          ${quote}[^${quote}]*
          %s
          [^${quote}]*${quote}
        )
        |
        (?:${quote}[^${quote}]*${quote})
      )
    `,
    `
      (?<=
        ${selectorPrefix ? selectorPrefix :
          `(?:${quote}|${patterns.allowedBeforeSelector})`}
      )
      (?<${GROUP_MAIN}>%s)
      (?=
        ${selectorSuffix ? selectorSuffix :
          `(?:${quote}|${patterns.allowedAfterSelector})`}
      )
    `,
    GROUP_MAIN,
  ));
}

/**
 * Get a {@link MangleExpression} to match selectors as standalone strings in
 * JavaScript, e.g. `foobar` in `document.getElementById("foobar");`.
 *
 * @returns The {@link MangleExpression}s to match standalone selectors in JS.
 */
function newSelectorAsStandaloneStringExpressions():
    Iterable<MangleExpression> {
  return [
    new SingleGroupMangleExpression(
      `
        (?:
          (?:${patterns.comment})
          |
          (?<=
            (?<${GROUP_QUOTE}>${patterns.quotes})
            \\s*
          )
          (?<${GROUP_MAIN}>%s)
          (?=
            \\s*
            \\k<${GROUP_QUOTE}>
          )
        )
      `,
      GROUP_MAIN,
    ),
  ];
}

/**
 * Get the set of {@link MangleExpression}s to match query selectors in
 * JavaScript. This will match:
 * - Query selectors (e.g. `foobar` in `querySelector(".foobar");`).
 * - Standalone strings (e.g. `foobar` in `getElementById("foobar");`).
 *
 * @param options The {@link QuerySelectorOptions}.
 * @returns A set of {@link MangleExpression}s.
 * @since v0.1.14
 * @version v0.1.24
 */
export default function querySelectorExpressionFactory(
  options: QuerySelectorOptions,
): Iterable<MangleExpression> {
  const result = [
    ...newQuerySelectorExpressions(options.prefix, options.suffix),
  ];

  if (options.suffix || options.prefix) {
    result.push(...newSelectorAsStandaloneStringExpressions());
  }

  return result;
}
