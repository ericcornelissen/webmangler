import type { MangleExpression } from "../../types";

import { NestedGroupMangleExpression } from "../utils/mangle-expressions";
import { QUOTES_ARRAY } from "./common";

const GROUP_MAIN = "main";

/**
 * Get {@link MangleExpression}s to match attributes in HTML, e.g. `data-foo` in
 * `<div data-foo="bar"></div>`.
 *
 * @returns The {@link MangleExpression}s to match element attributes in HTML.
 */
function newElementAttributeExpressions(): MangleExpression[] {
  return QUOTES_ARRAY.map((quote: string) => new NestedGroupMangleExpression(
    `
      (?:
        (?:<!--.*-->)
        |
        (?<=\\<\\s*[a-zA-Z0-9]+\\s+)
        (?<${GROUP_MAIN}>
          (?:
            [^>\\s=]+
            (?:\\s*=\\s*${quote}[^${quote}]*${quote})?
            \\s+
          )*
          %s
        )
        (?=\\s|\\=|\\/|\\>)
      )
    `,
    `
      (?<=\\s|^)
      (?<${GROUP_MAIN}>%s)
      (?=\\=|\\s|\\/|\\>|$)
    `,
    GROUP_MAIN,
  ));
}

/**
 * Get the set of {@link MangleExpression}s to match attributes in HTML. This
 * will match:
 * - Element attributes (e.g. `data-foo` in `<div data-foo="bar"></div>`).
 *
 * @returns A set of {@link MangleExpression}s.
 * @since v0.1.14
 * @version v0.1.21
 */
export default function attributeExpressionFactory():
    Iterable<MangleExpression> {
  return [
    ...newElementAttributeExpressions(),
  ];
}
