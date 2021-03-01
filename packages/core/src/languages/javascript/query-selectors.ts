import type { MangleExpression } from "../../types";
import type { QuerySelectorOptions } from "../options";

import { SingleGroupMangleExpression } from "../utils/mangle-expressions";

const GROUP_MAIN = "main";
const GROUP_QUOTE = "quote";

/**
 * Get {@link MangleExpression}s to match query selectors in JavaScript, e.g.
 * `foobar` in `document.querySelectorAll(".foobar");`.
 *
 * @param prefix The query selector prefix (e.g. `"\\."` or `"#"`).
 * @returns The {@link MangleExpression}s to match query selectors in JS.
 */
function newQuerySelectorExpressions(prefix: string): MangleExpression[] {
  return ["\"", "'", "`"].map((quote) => new SingleGroupMangleExpression(
    `
      (?<=
        ${quote}[^${quote}]*
        ${prefix}
      )
      (?<${GROUP_MAIN}>%s)
      (?=${quote}|\\,|\\.|\\#|\\[|\\:|\\)|\\>|\\+|\\~|\\s)
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
        (?<${GROUP_QUOTE}>"|'|\`)
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
  return [
    ...newQuerySelectorExpressions(options.prefix),
    newSelectorAsStandaloneStringExpression(),
  ];
}
