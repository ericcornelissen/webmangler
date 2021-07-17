import type { MangleExpression } from "@webmangler/types";
import type { SingleValueAttributeOptions } from "../options";

import { SingleGroupMangleExpression } from "@webmangler/language-utils";
import { patterns, QUOTED_ATTRIBUTE_PATTERN } from "./common";

const GROUP_MAIN = "main";
const GROUP_QUOTE = "quote";

/**
 * Get a {@link MangleExpression} to match quoted element attribute values in
 * HTML, e.g. `bar` in `<div data-foo="bar"></div>` or `sun` in `<div data-
 * praise="thesun"></div>` if the value prefix is "the".
 *
 * @param attributesPattern The pattern of attribute names.
 * @param valuePrefix An pattern of the required prefix for values.
 * @param valueSuffix An pattern of the required suffix for values.
 * @returns The {@link MangleExpression}s to match quoted attribute values.
 */
function newQuotedValueExpressions(
  attributesPattern: string,
  valuePrefix: string,
  valueSuffix: string,
): Iterable<MangleExpression> {
  return [
    new SingleGroupMangleExpression(
      `
        (?:
          (?:${patterns.comment})
          |
          (?<=
            ${patterns.tagOpen}
            ${patterns.attributes}
            ${QUOTED_ATTRIBUTE_PATTERN(
              attributesPattern,
              `(?<${GROUP_QUOTE}>${patterns.quotes})`,
            )}
            ${valuePrefix}
          )
          (?<${GROUP_MAIN}>%s)
          (?=
            ${valueSuffix}
            \\s*\\k<${GROUP_QUOTE}>
            [^>]*
            >
          )
        )
      `,
      GROUP_MAIN,
    ),
  ];
}

/**
 * Get a {@link MangleExpression} to match unquoted element attribute values in
 * HTML, e.g. `bar` in `<div data-foo=bar></div>` or `sun` in `<div data-
 * praise=thesun></div>` if the value prefix is "the".
 *
 * @param attributesPattern The pattern of attribute names.
 * @param valuePrefix An pattern of the required prefix for values.
 * @param valueSuffix An pattern of the required suffix for values.
 * @returns The {@link MangleExpression}s to match unquoted attribute values.
 */
function newUnquotedValueExpressions(
  attributesPattern: string,
  valuePrefix: string,
  valueSuffix: string,
): Iterable<MangleExpression> {
  return [
    new SingleGroupMangleExpression(
      `
        (?:
          (?:${patterns.comment})
          |
          (?<=
            ${patterns.tagOpen}
            ${patterns.attributes}
            (?:${attributesPattern})
            \\s*=\\s*
            ${valuePrefix}
          )
          (?<${GROUP_MAIN}>%s)
          (?=
            ${valueSuffix}
            ${patterns.afterAttribute}
          )
        )
      `,
      GROUP_MAIN,
    ),
  ];
}

/**
 * Get the set of {@link MangleExpression}s to match single-value attribute
 * values in HTML. This will match:
 * - Quoted attribute values (e.g. `bar` in `<div data-foo="bar"></div>`).
 * - Unquoted attribute values (e.g. `bar` in `<div data-foo=bar></div>`).
 *
 * @param options The {@link SingleValueAttributeOptions}.
 * @returns A set of {@link MangleExpression}s.
 * @since v0.1.14
 * @version v0.1.22
 */
export default function singleValueAttributeExpressionFactory(
  options: SingleValueAttributeOptions,
): Iterable<MangleExpression> {
  const attributesPattern = Array.from(options.attributeNames).join("|");
  const valuePrefix = options.valuePrefix ? options.valuePrefix : "";
  const valueSuffix = options.valueSuffix ? options.valueSuffix : "";

  return [
    ...newQuotedValueExpressions(attributesPattern, valuePrefix, valueSuffix),
    ...newUnquotedValueExpressions(attributesPattern, valuePrefix, valueSuffix),
  ];
}
