import type { MangleExpression } from "../../types";

import { SingleGroupMangleExpression } from "../utils/mangle-expressions";

const GROUP_MAIN = "main";

/**
 * TODO.
 *
 * @returns TODO.
 * @since v0.1.14
 */
export default function attributes(): MangleExpression[] {
  return [
    // Attribute selector (e.g. `[data-foo] { }`)
    new SingleGroupMangleExpression(
      `
        (?<!"[^"}]*|'[^'}]*)
        (?<=\\[\\s*)
        (?<${GROUP_MAIN}>%s)
        (?=
          \\s*
          (?:\\]|\\=|\\~=|\\|=|\\^=|\\$=|\\*=)
        )
      `,
      GROUP_MAIN,
    ),

    // Attribute usage (e.g. `content: attr(data-foo);`)
    new SingleGroupMangleExpression(
      `
        (?<!"[^";]*|'[^';]*)
        (?<=
          attr\\s*\\(\\s*
        )
        (?<${GROUP_MAIN}>%s)
        (?=
          (\\s+([a-zA-Z]+|%))?
          \\s*(,|\\))
        )
      `,
      GROUP_MAIN,
    ),
  ];
}
