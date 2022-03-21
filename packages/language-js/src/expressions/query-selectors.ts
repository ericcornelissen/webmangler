import type {
  MangleExpression,
  QuerySelectorOptions,
} from "@webmangler/types";

import {
  NestedGroupMangleExpression,
  SingleGroupMangleExpression,
} from "@webmangler/language-utils";
import { patterns, QUOTES_ARRAY } from "./common";

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
  return QUOTES_ARRAY.map((quote) => {
    const captureGroup = NestedGroupMangleExpression.CAPTURE_GROUP({
      before: `${quote}(?:\\\\${quote}|[^${quote}])*`,
      after: `(?:\\\\${quote}|[^${quote}])*${quote}`,
    });

    return new NestedGroupMangleExpression({
      patternTemplate: `
        (?:
          (?:${patterns.comment})
          |
          ${captureGroup}
          |
          (?:
            ${quote}
            (?:\\\\${quote}|[^${quote}])*
            ${quote}
          )
        )
      `,
      subPatternTemplate: `
        (?<=
          ${selectorPrefix || `(?:${quote}|${patterns.allowedBeforeSelector})`}
        )
        ${NestedGroupMangleExpression.SUB_CAPTURE_GROUP}
        (?=
          ${selectorSuffix || `(?:${quote}|${patterns.allowedAfterSelector})`}
        )
      `,
    });
  });
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
    new SingleGroupMangleExpression({
      patternTemplate: `
        (?:
          (?:${patterns.comment})
          |
          (?<=
            (?<${GROUP_QUOTE}>${patterns.quotes})
            \\s*
          )
          ${SingleGroupMangleExpression.CAPTURE_GROUP}
          (?=
            \\s*
            \\k<${GROUP_QUOTE}>
          )
        )
      `,
    }),
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
 * @version v0.1.28
 */
function querySelectorExpressionFactory(
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

export default querySelectorExpressionFactory;
