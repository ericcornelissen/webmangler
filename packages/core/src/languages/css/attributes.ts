import type { MangleExpression } from "../../types";

import { SingleGroupMangleExpression } from "../utils/mangle-expressions";

const GROUP_MAIN = "main";

/**
 * Get a {@link MangleExpression} to match attribute selectors in CSS, e.g.
 * `data-foo` in `[data-foo] { }`.
 *
 * @returns The {@link MangleExpression} to match attribute selectors in CSS.
 */
function newAttributeSelectorExpression(): MangleExpression {
  return new SingleGroupMangleExpression(
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
  );
}

/**
 * Get a {@link MangleExpression} to match attribute usage in CSS, e.g.
 * `data-foo` in `content: attr(data-foo);`.
 *
 * @returns The {@link MangleExpression} to match attribute usage in CSS.
 */
function newAttributeUsageExpression(): MangleExpression {
  return new SingleGroupMangleExpression(
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
  );
}

/**
 * Get the set of {@link MangleExpression}s to match attributes in CSS. This
 * will match:
 * - Attribute selectors (e.g. `data-foo` in `[data-foo] { }`).
 * - Attribute usage (e.g. `data-foo` in `content: attr(data-foo);`).
 *
 * @returns A set of {@link MangleExpression}s.
 * @since v0.1.14
 */
export default function attributeExpressionFactory(): MangleExpression[] {
  return [
    newAttributeSelectorExpression(),
    newAttributeUsageExpression(),
  ];
}
