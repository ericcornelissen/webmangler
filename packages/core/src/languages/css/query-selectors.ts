import type { MangleExpression } from "../../types";
import type { QuerySelectorOptions } from "../options";

import { SingleGroupMangleExpression } from "../utils/mangle-expressions";
import { NOT_IN_A_BLOCK_OR_STRING } from "./common";

const GROUP_MAIN = "main";

/**
 * Get a {@link MangleExpression} to match query selectors in CSS, e.g. `foobar`
 * in `.foobar { }`.
 *
 * @param selectorPrefix The query selector prefix.
 * @param selectorSuffix The query selector suffix.
 * @returns The {@link MangleExpression} to match query selectors in CSS.
 */
function newCssSelectorExpression(
  selectorPrefix: string,
  selectorSuffix: string,
): MangleExpression {
  return new SingleGroupMangleExpression(
    `
      ${NOT_IN_A_BLOCK_OR_STRING}
      (?<=${selectorPrefix})
      (?<${GROUP_MAIN}>%s)
      (?=
        ${selectorSuffix}
        (?:\\{|\\,|\\.|\\#|\\[|\\:|\\)|\\>|\\+|\\~|\\s|$)
      )
    `,
    GROUP_MAIN,
  );
}

/**
 * Get the set of {@link MangleExpression}s to match CSS selectors in CSS. This
 * will match:
 * - CSS selectors (e.g. `foobar` in `.foobar { }`).
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
    newCssSelectorExpression(selectorPrefix, selectorSuffix),
  ];
}
