import type { MangleExpression } from "../../types";
import type { MultiValueAttributesOptions } from "../options";

import { NestedGroupExpression } from "../utils/mangle-expressions";

const GROUP_MAIN = "main";

/**
 * Get a {@link MangleExpression} to match element attribute values in HTML,
 * e.g. `the` and `sun` in `<img data-praise="the sun">`.
 *
 * @param attributeNames A list of attribute names.
 * @returns The {@link MangleExpression} to match attribute values in HTML.
 */
function newElementAttributeMultiValueExpression(
  attributeNames: string[],
): MangleExpression[] {
  const attributeNamesExpression = attributeNames.join("|");
  return ["\"", "'"].map((quote) => new NestedGroupExpression(
    `
      (?<=
        \\s
        (?:${attributeNamesExpression})
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
  ));
}

/**
 * Get the set of {@link MangleExpression}s to match multi-value attribute
 * values in HTML. This will match:
 * - Attribute values (e.g. `the` and `sun` in `<img data-praise="the sun">`).
 *
 * @param options The {@link MultiValueAttributesOptions}.
 * @returns A set of {@link MangleExpression}s.
 * @since v0.1.14
 */
export default function multiValueAttributeExpressionFactory(
  options: MultiValueAttributesOptions,
): MangleExpression[] {
  return [
    ...newElementAttributeMultiValueExpression(options.attributeNames),
  ];
}
