import type { MangleExpression } from "../../types";
import type { QuerySelectorOptions } from "../options";

import { QUERY_SELECTOR_COMBINERS } from "../common";
import { SingleGroupMangleExpression } from "../utils/mangle-expressions";
import { QUOTES_ARRAY, QUOTES_PATTERN } from "./common";

const GROUP_MAIN = "main";
const GROUP_QUOTE = "quote";

/**
 * Get {@link MangleExpression}s to match query selectors in JavaScript, e.g.
 * `foobar` in `document.querySelectorAll(".foobar");`.
 *
 * @param selectorPrefix The query selector prefix.
 * @param selectorSuffix The query selector suffix.
 * @returns The {@link MangleExpression}s to match query selectors in JS.
 */
function newQuerySelectorExpressions(
  selectorPrefix: string,
  selectorSuffix: string,
): MangleExpression[] {
  return QUOTES_ARRAY.map((quote) => new SingleGroupMangleExpression(
    `
      (?<=
        ${quote}[^${quote}]*
        ${selectorPrefix}
      )
      (?<${GROUP_MAIN}>%s)
      (?=
        ${selectorSuffix}
        (?:${quote}|${QUERY_SELECTOR_COMBINERS})
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
      (?<=
        (?<${GROUP_QUOTE}>${QUOTES_PATTERN})
        \\s*
      )
      (?<${GROUP_MAIN}>%s)
      (?=
        \\s*
        \\k<${GROUP_QUOTE}>
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
 */
export default function querySelectorExpressionFactory(
  options: QuerySelectorOptions,
): MangleExpression[] {
  const selectorPrefix = options.prefix ? options.prefix : "";
  const selectorSuffix = options.suffix ? options.suffix : "";

  return [
    ...newQuerySelectorExpressions(selectorPrefix, selectorSuffix),
    newSelectorAsStandaloneStringExpression(),
  ];
}
