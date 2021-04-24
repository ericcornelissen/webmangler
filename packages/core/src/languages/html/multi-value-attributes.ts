import type { MangleExpression } from "../../types";
import type { MultiValueAttributeOptions } from "../options";

import { NestedGroupExpression } from "../utils/mangle-expressions";
import { QUOTED_ATTRIBUTE_PATTERN, QUOTES_ARRAY } from "./common";

const GROUP_MAIN = "main";

/**
 * Get {@link MangleExpression}s to match element attribute values in HTML, e.g.
 * `the` and `sun` in `<img data-praise="the sun">`.
 *
 * @param attributesPattern The pattern of attribute names.
 * @returns The {@link MangleExpression} to match attribute values in HTML.
 */
function newElementAttributeMultiValueExpressions(
  attributesPattern: string,
): MangleExpression[] {
  return QUOTES_ARRAY.map((quote) => new NestedGroupExpression(
    `
      (?<=
        \\<\\s*[a-zA-Z0-9]+\\s+
        (?:
          [^>\\s=]+
          (?:\\s*=\\s*${quote}[^${quote}]*${quote})?
          \\s+
        )*
        ${QUOTED_ATTRIBUTE_PATTERN(attributesPattern, quote)}
      )
      (?<${GROUP_MAIN}>
        (?:[^${quote}]+\\s)?
        %s
        (?:\\s[^${quote}]+)?
      )
      (?=
        \\s*${quote}
        [^>]*
        >
      )
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
 * @version v0.1.18
 */
export default function multiValueAttributeExpressionFactory(
  options: MultiValueAttributeOptions,
): Iterable<MangleExpression> {
  const attributesPattern = Array.from(options.attributeNames).join("|");

  return [
    ...newElementAttributeMultiValueExpressions(attributesPattern),
  ];
}
