import type { MangleExpression } from "../../types";
import type { MultiValueAttributesOptions } from "../options";

import { NestedGroupExpression } from "../utils/mangle-expressions";

const GROUP_MAIN = "main";

/**
 * TODO.
 *
 * @param options TODO.
 * @returns TODO.
 * @since v0.1.14
 */
export default function multiValueAttributes(
  options: MultiValueAttributesOptions,
): MangleExpression[] {
  const attributeNames = options.attributeNames.join("|");
  return [
    ...["\"", "'"].map((quote) => new NestedGroupExpression(
      `
        (?<=
          \\s
          (?:${attributeNames})
          \\s*=\\s*
          ${quote}
          \\s*
        )
        (?<${GROUP_MAIN}>
          (?:[^${quote}]+\\s)?
          %s
          (?:\\s[^${quote}]+)?
        )
        (?=\\s*${quote})
      `,
      `
        (?<=^|\\s)
        (?<${GROUP_MAIN}>%s)
        (?=$|\\s)
      `,
      GROUP_MAIN,
    )),
  ];
}
