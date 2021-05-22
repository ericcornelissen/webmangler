import type { MangleExpression } from "../../types";
import type { CssDeclarationValueOptions } from "../options";

import { SingleGroupMangleExpression } from "../utils/mangle-expressions";

const GROUP_MAIN = "main";

/**
 * Get a {@link MangleExpression} to match the value of CSS declarations in CSS,
 * e.g. `serif` in `div { font: serif; }`.
 *
 * @param valuePrefix The prefix required on values.
 * @param valueSuffix The suffix required on values.
 * @returns The {@link MangleExpression} to match declaration values in CSS.
 */
function newCssDeclarationValueExpression(
  valuePrefix: string,
  valueSuffix: string,
): MangleExpression {
  return new SingleGroupMangleExpression(
    `
      (?:
        (?:"[^"]*"|'[^']*'|\\/\\*[^\\*\\/]*\\*\\/)
        |
        (?<=
          \\{
          [^\\}]+
          :
          [^;]*
          (?<=:|\\s|\\*\\/)
          ${valuePrefix}
        )
        (?<${GROUP_MAIN}>%s)
        (?=
          ${valueSuffix}
          (?:\\s|\\!|\\/\\*|\\;|\\})
        )
      )
    `,
    GROUP_MAIN,
  );
}

/**
 * Get the set of {@link MangleExpression}s to match the values of CSS
 * declarations in CSS. This will match:
 * - Values as part of a CSS declaration (e.g. `bar` in `div { foo: bar }`).
 *
 * @param options The {@link CssDeclarationValueOptions}.
 * @returns A set of {@link MangleExpression}s.
 * @since v0.1.14
 * @version v0.1.21
 */
export default function cssDeclarationValueExpressionFactory(
  options: CssDeclarationValueOptions,
): Iterable<MangleExpression> {
  const valuePrefix = options.prefix ? options.prefix : "";
  const valueSuffix = options.suffix ? options.suffix : "";

  return [
    newCssDeclarationValueExpression(valuePrefix, valueSuffix),
  ];
}
