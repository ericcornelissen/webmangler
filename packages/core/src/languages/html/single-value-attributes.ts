import type { MangleExpression } from "../../types";
import type { SingleValueAttributeOptions } from "../options";

import { SingleGroupMangleExpression } from "../utils/mangle-expressions";
import { QUOTED_ATTRIBUTE_PATTERN, QUOTES_PATTERN } from "./common";

const GROUP_MAIN = "main";
const GROUP_QUOTE = "quote";

/**
 * Get a {@link MangleExpression} to match quoted element attribute values in
 * HTML, e.g. `bar` in `<div data-foo="bar"></div>` or `sun` in
 * `<div data-praise="thesun"></div>` if the value prefix is "the".
 *
 * @param attributeNames A list of attribute names.
 * @param valuePrefix An expression of the required prefix for values.
 * @param valueSuffix An expression of the required suffix for values.
 * @returns The {@link MangleExpression} to match quoted attribute values.
 */
function newQuotedValueExpression(
  attributeNames: string[],
  valuePrefix: string,
  valueSuffix: string,
): MangleExpression {
  const attributesPattern = attributeNames.join("|");
  return new SingleGroupMangleExpression(
    `
      (?<=
        ${QUOTED_ATTRIBUTE_PATTERN(
          attributesPattern,
          `(?<${GROUP_QUOTE}>${QUOTES_PATTERN})`,
        )}
        ${valuePrefix}
      )
      (?<${GROUP_MAIN}>%s)
      (?=
        ${valueSuffix}
        \\s*\\k<${GROUP_QUOTE}>
      )
    `,
    GROUP_MAIN,
  );
}

/**
 * Get a {@link MangleExpression} to match unquoted element attribute values in
 * HTML, e.g. `bar` in `<div data-foo=bar></div>` or `sun` in
 * `<div data-praise=thesun></div>` if the value prefix is "the".
 *
 * @param attributeNames A list of attribute names.
 * @param valuePrefix An expression of the required prefix for values.
 * @param valueSuffix An expression of the required suffix for values.
 * @returns The {@link MangleExpression} to match unquoted attribute values.
 */
function newUnquotedValueExpression(
  attributeNames: string[],
  valuePrefix: string,
  valueSuffix: string,
): MangleExpression {
  const attributeNamesExpression = attributeNames.join("|");
  return new SingleGroupMangleExpression(
    `
      (?<=
        \\s(?:${attributeNamesExpression})\\s*=
        ${valuePrefix}
      )
      (?<${GROUP_MAIN}>%s)
      (?=
        ${valueSuffix}
        (?:\\s|\\/|\\>)
      )
    `,
    GROUP_MAIN,
  );
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
 */
export default function singleValueAttributeExpressionFactory(
  options: SingleValueAttributeOptions,
): MangleExpression[] {
  const valuePrefix = options.valuePrefix ? options.valuePrefix : "";
  const valueSuffix = options.valueSuffix ? options.valueSuffix : "";

  return [
    newQuotedValueExpression(
      options.attributeNames,
      valuePrefix,
      valueSuffix,
    ),
    newUnquotedValueExpression(
      options.attributeNames,
      valuePrefix,
      valueSuffix,
    ),
  ];
}
