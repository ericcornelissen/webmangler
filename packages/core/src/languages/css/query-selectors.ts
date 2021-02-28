import type { MangleExpression } from "../../types";
import type { QuerySelectorOptions } from "../options";

import { SingleGroupMangleExpression } from "../utils/mangle-expressions";

const GROUP_MAIN = "main";

/**
 * Get a {@link MangleExpression} to match query selectors in CSS, e.g. `foobar`
 * in `.foobar { }`.
 *
 * @param prefix The query selector prefix (e.g. `"\\."` or `"#"`).
 * @returns The {@link MangleExpression} to match query selectors in CSS.
 */
function newCssSelectorExpression(prefix: string): MangleExpression {
  return new SingleGroupMangleExpression(
    `
      (?<!"[^"}]*|'[^'}]*)
      (?<=${prefix})
      (?<${GROUP_MAIN}>%s)
      (?=\\{|\\,|\\.|\\#|\\[|\\:|\\)|\\>|\\+|\\~|\\s|$)
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
  return [
    newCssSelectorExpression(options.prefix),
  ];
}
