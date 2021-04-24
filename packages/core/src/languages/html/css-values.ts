import type { MangleExpression } from "../../types";
import type { CssDeclarationValueOptions } from "../options";

import {
  NestedGroupExpression,
  SingleGroupMangleExpression,
} from "../utils/mangle-expressions";
import { QUOTED_ATTRIBUTE_PATTERN, QUOTES_ARRAY } from "./common";

const GROUP_MAIN = "main";

/**
 * Get {@link MangleExpression}s to match the value of CSS declarations in HTML,
 * e.g. `serif` in `<div style="font: serif"><div>"`.
 *
 * @param valuePrefix The prefix required on values.
 * @param valueSuffix The suffix required on values.
 * @returns The {@link MangleExpression}s to match values in style attributes.
 */
function newStyleDeclarationValueExpressions(
  valuePrefix: string,
  valueSuffix: string,
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
        ${QUOTED_ATTRIBUTE_PATTERN("style", quote)}
      )
      (?<${GROUP_MAIN}>
        [^${quote}]+
        :\\s*
        ${valuePrefix}
        %s
        ${valueSuffix}
        (?:\\s*\\;[^${quote}]*)?
      )
      (?=
        \\s*${quote}
        [^>]*
        >
      )
    `,
    `
      (?<=
        :\\s*
        ${valuePrefix}
      )
      (?<${GROUP_MAIN}>%s)
      (?=
        ${valueSuffix}
        \\s*(;|$)
      )
    `,
    GROUP_MAIN,
  ));
}

/**
 * Get {@link MangleExpression}s to match the value of CSS declarations in
 * unquoted HTML attributes, e.g. `serif` in `<div style=font:serif><div>"`.
 *
 * @param propertyPrefix The prefix required on properties.
 * @param propertySuffix The suffix required on properties.
 * @returns The {@link MangleExpression}s to match unquoted attribute values.
 */
function newUnquotedStyleDeclarationValueExpressions(
  propertyPrefix: string,
  propertySuffix: string,
): MangleExpression[] {
  return QUOTES_ARRAY.map((quote) => new SingleGroupMangleExpression(
    `
      (?<=
        \\<\\s*[a-zA-Z0-9]+\\s+
        (?:
          [^>\\s=]+
          (?:\\s*=\\s*${quote}[^${quote}]*${quote})?
          \\s+
        )*
        style\\s*=\\s*[^\\s"']+:${propertyPrefix}
      )
      (?<${GROUP_MAIN}>%s)
      (?=
        ${propertySuffix}
        (?:\\;|\\s|\\/|\\>)
      )
    `,
    GROUP_MAIN,
  ));
}

/**
 * Get the set of {@link MangleExpression}s to match the values of CSS
 * declarations in CSS. This will match:
 * - Values in style attributes (e.g. `bar` in `<img style="foo: bar">`).
 *
 * @param options The {@link CssDeclarationValueOptions}.
 * @returns A set of {@link MangleExpression}s.
 * @since v0.1.14
 * @version v0.1.19
 */
export default function cssDeclarationValueExpressionFactory(
  options: CssDeclarationValueOptions,
): Iterable<MangleExpression> {
  const valuePrefix = options.prefix ? options.prefix : "";
  const valueSuffix = options.suffix ? options.suffix : "";

  return [
    ...newStyleDeclarationValueExpressions(valuePrefix, valueSuffix),
    ...newUnquotedStyleDeclarationValueExpressions(valuePrefix, valueSuffix),
  ];
}
