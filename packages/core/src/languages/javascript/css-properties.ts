import type { MangleExpression } from "../../types";
import type { CssDeclarationPropertyOptions } from "../options";

import { SingleGroupMangleExpression } from "../utils/mangle-expressions";

const GROUP_MAIN = "main";
const GROUP_QUOTE = "q";

/**
 * Get a {@link MangleExpression} to match property names as standalone strings
 * in JavaScript, e.g. `foobar` in `$element.style.getPropertyValue("foobar");`.
 *
 * @param propertyPrefix The prefix required on property names.
 * @param propertySuffix The suffix required on property names.
 * @returns The {@link MangleExpression} to match standalone properties in JS.
 */
function newPropertyAsStandaloneStringExpression(
  propertyPrefix: string,
  propertySuffix: string,
): MangleExpression {
  return new SingleGroupMangleExpression(
    `
      (?<=
        (?<${GROUP_QUOTE}>"|'|\`)
        \\s*
        ${propertyPrefix}
      )
      (?<${GROUP_MAIN}>%s)
      (?=
        ${propertySuffix}
        \\s*
        \\k<${GROUP_QUOTE}>
      )
    `,
    GROUP_MAIN,
  );
}

/**
 * Get the set of {@link MangleExpression}s to match the properties of CSS
 * declarations in JavaScript. This will match:
 * - Standalone strings (e.g. `foobar` in `getPropertyValue("foobar");`).
 *
 * @param options The {@link CssDeclarationPropertyOptions}.
 * @returns A set of {@link MangleExpression}s.
 * @since v0.1.14
 */
export default function cssDeclarationPropertyExpressionFactory(
  options: CssDeclarationPropertyOptions,
): MangleExpression[] {
  const propertyPrefix = options.prefix ? options.prefix : "";
  const propertySuffix = options.suffix ? options.suffix : "";

  return [
    newPropertyAsStandaloneStringExpression(propertyPrefix, propertySuffix),
  ];
}
