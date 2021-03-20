import type { MangleExpression } from "../../types";
import type { SingleValueAttributeOptions } from "../options";

import { SingleGroupMangleExpression } from "../utils/mangle-expressions";
import { QUOTES_PATTERN } from "./common";

const GROUP_MAIN = "main";
const GROUP_QUOTE = "quote";

/**
 * Get a {@link MangleExpression} to match attribute selector values in CSS,
 * e.g. `bar` in `[data-foo="bar"] { }` or `sun` in `[data-praise="thesun"] { }`
 * if the value prefix is "the".
 *
 * @param attributeNames A list of attribute names.
 * @param valuePrefix An expression of the required prefix for values.
 * @param valueSuffix An expression of the required suffix for values.
 * @returns The {@link MangleExpression} to match attribute values in CSS.
 */
function newAttributeSelectorSingleValueExpression(
  attributeNames: string[],
  valuePrefix: string,
  valueSuffix: string,
): MangleExpression {
  const attributeNamesExpression = attributeNames.join("|");
  return new SingleGroupMangleExpression(
    `
      (?<=
        \\[\\s*
        (?:${attributeNamesExpression})\\s*
        (?:\\=|\\~=|\\|=|\\^=|\\$=|\\*=)\\s*
        (?<${GROUP_QUOTE}>${QUOTES_PATTERN})\\s*
        ${valuePrefix}
      )
      (?<${GROUP_MAIN}>%s)
      (?=
        ${valueSuffix}
        \\s*\\k<${GROUP_QUOTE}>
        \\s*\\]
      )
    `,
    GROUP_MAIN,
  );
}

/**
 * Get the set of {@link MangleExpression}s to match single-value attribute
 * values in CSS. This will match:
 * - Attribute selector values (e.g. `bar` in `[data-foo="bar"] { }`).
 *
 * @param options The {@link SingleValueAttributeOptions}.
 * @returns A set of {@link MangleExpression}s.
 * @since v0.1.14
 */
export default function singleValueAttributeExpressionFactory(
  options: SingleValueAttributeOptions,
): MangleExpression[] {
  const valuePrefix = options.valuePrefix ? options.valuePrefix : "";
  const valueSuffix = options.valueSuffix ? options.valueSuffix : "";

  return [
    newAttributeSelectorSingleValueExpression(
      options.attributeNames,
      valuePrefix,
      valueSuffix,
    ),
  ];
}
