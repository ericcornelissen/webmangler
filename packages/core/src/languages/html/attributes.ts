import type { MangleExpression } from "../../types";

import { NestedGroupExpression } from "../utils/mangle-expressions";

const GROUP_MAIN = "main";

/**
 * TODO.
 *
 * @returns TODO.
 * @since v0.1.14
 */
export default function attributes(): MangleExpression[] {
  return [
    ...["\"", "'"].map((quote) => new NestedGroupExpression(
      `
        (?<=
          \\<
          \\s*
          [a-zA-Z0-9]+
          \\s+
        )
        (?<${GROUP_MAIN}>
          (?:
            [^>${quote}]+
            ${quote}[^${quote}]*${quote}
            \\s
          )*
          %s
          (?:
            (?:\\=|\\s)
            [^>]*
          )?
        )
        (?=\\>)
      `,
      `
        (?<=\\s|^)
        (?<${GROUP_MAIN}>%s)
        (?=\\=|\\s|$)
      `,
      GROUP_MAIN,
    )),
  ];
}
