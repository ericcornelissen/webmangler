import type { MangleExpression } from "../../types";
import type { QuerySelectorOptions } from "../options";

import {
  QUERY_SELECTOR_ALLOWED_AFTER,
  QUERY_SELECTOR_ALLOWED_BEFORE,
} from "../common";
import {
  NestedGroupMangleExpression,
  SingleGroupMangleExpression,
} from "../utils/mangle-expressions";
import { QUOTES_ARRAY, QUOTES_PATTERN } from "./common";

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
): MangleExpression[] {
  return QUOTES_ARRAY.map((quote) => new NestedGroupMangleExpression(
    `
      (?:
        (?:\\/\\*[^\\*\\/]*\\*\\/|\\/\\/[^\\r\\n]+\\r?\\n)
        |
        (?<${GROUP_MAIN}>
          ${quote}[^${quote}]*
          %s
          [^${quote}]*${quote}
        )
      )
    `,
    `
      (?<=
        ${selectorPrefix ? selectorPrefix :
          `(?:${quote}|${QUERY_SELECTOR_ALLOWED_BEFORE})`}
      )
      (?<${GROUP_MAIN}>%s)
      (?=
        ${selectorSuffix ? selectorSuffix :
          `(?:${quote}|${QUERY_SELECTOR_ALLOWED_AFTER})`}
      )
    `,
    GROUP_MAIN,
  ));
}

/**
 * Get a {@link MangleExpression} to match selectors as standalone strings in
 * JavaScript, e.g. `foobar` in `document.getElementById("foobar");`.
 *
 * @returns The {@link MangleExpression} to match standalone selectors in JS.
 */
function newSelectorAsStandaloneStringExpression(): MangleExpression {
  return new SingleGroupMangleExpression(
    `
      (?:
        (?:\\/\\*[^\\*\\/]*\\*\\/|\\/\\/[^\\r\\n]+\\r?\\n)
        |
        (?<=
          (?<${GROUP_QUOTE}>${QUOTES_PATTERN})
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
  );
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
 * @version v0.1.22
 */
export default function querySelectorExpressionFactory(
  options: QuerySelectorOptions,
): Iterable<MangleExpression> {
  const result = [
    ...newQuerySelectorExpressions(options.prefix, options.suffix),
  ];

  if (options.suffix || options.prefix) {
    result.push(newSelectorAsStandaloneStringExpression());
  }

  return result;
}
