import type { MangleExpression } from "../../types";
import type { SingleValueAttributesOptions } from "../options";

import { SingleGroupMangleExpression } from "../utils/mangle-expressions";

const GROUP_MAIN = "main";
const GROUP_QUOTE = "quote";

/**
 * TODO.
 *
 * @param options TODO.
 * @returns TODO.
 * @since v0.1.14
 */
export default function singleValueAttributes(
  options: SingleValueAttributesOptions,
): MangleExpression[] {
  const attributeNames = options.attributeNames.join("|");
  return [
    new SingleGroupMangleExpression(
      `
        (?<=
          \\[\\s*(?:${attributeNames})
          \\s*
          (?:\\=|\\~=|\\|=|\\^=|\\$=|\\*=)
          \\s*
          (?<${GROUP_QUOTE}>"|')
          \\s*
          ${options.valuePrefix ? options.valuePrefix : ""}
        )
        (?<${GROUP_MAIN}>%s)
        (?=
          ${options.valueSuffix ? options.valueSuffix : ""}
          \\s*
          \\k<${GROUP_QUOTE}>
          \\s*
          \\]
        )
      `,
      GROUP_MAIN,
    ),
  ];
}
