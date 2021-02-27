import type { MangleExpression } from "../../types";
import type { QuerySelectorsOptions } from "../options";

import { SingleGroupMangleExpression } from "../utils/mangle-expressions";

const GROUP_MAIN = "main";

/**
 * TODO.
 *
 * @param options TODO.
 * @returns TODO.
 * @since v0.1.14
 */
export default function querySelectors(
  options: QuerySelectorsOptions,
): MangleExpression[] {
  return [
    new SingleGroupMangleExpression(
      `
        (?<!"[^"}]*|'[^'}]*)
        (?<=${options.prefix})
        (?<${GROUP_MAIN}>%s)
        (?=\\{|\\,|\\.|\\#|\\[|\\:|\\)|\\>|\\+|\\~|\\s|$)
      `,
      GROUP_MAIN,
    ),
  ];
}
