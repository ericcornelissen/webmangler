import type { MangleExpression } from "../../types";
import type { MultiValueAttributeOptions } from "../options";

import { NestedGroupExpression } from "../utils/mangle-expressions";
import { QUOTED_ATTRIBUTE_PATTERN, QUOTES_ARRAY } from "./common";

const GROUP_MAIN = "main";

/**
 * Get {@link MangleExpression}s to match element attribute values in HTML, e.g.
 * `the` and `sun` in `<img data-praise="the sun">`.
 *
 * @param attributeNames A list of attribute names.
 * @returns The {@link MangleExpression} to match attribute values in HTML.
 */
function newElementAttributeMultiValueExpressions(
  attributeNames: string[],
): MangleExpression[] {
  const attributesPattern = attributeNames.join("|");
  return QUOTES_ARRAY.map((quote) => new NestedGroupExpression(
    `
      (?<=${QUOTED_ATTRIBUTE_PATTERN(attributesPattern, quote)})
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
 * @param options The {@link MultiValueAttributeOptions}.
 * @returns A set of {@link MangleExpression}s.
 * @since v0.1.14
 */
export default function multiValueAttributeExpressionFactory(
  options: MultiValueAttributeOptions,
): MangleExpression[] {
  const attributeNames = Array.from(options.attributeNames);

  return [
    ...newElementAttributeMultiValueExpressions(attributeNames),
  ];
}
