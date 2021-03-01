import type { MangleExpression } from "../../types";
import type { CssDeclarationPropertyOptions } from "../options";

import { SingleGroupMangleExpression } from "../utils/mangle-expressions";

const GROUP_MAIN = "main";
const GROUP_QUOTE = "q";

/**
 * Get a {@link MangleExpression} to match property names as standalone strings
 * in JavaScript, e.g. `foobar` in `$element.style.getPropertyValue("foobar");`.
 *
 * @param prefix The prefix required on property names.
 * @param suffix The suffix required on property names.
 * @returns The {@link MangleExpression} to match standalone properties in JS.
 */
function newPropertyAsStandaloneStringExpression(
  prefix: string,
  suffix: string,
): MangleExpression {
  return new SingleGroupMangleExpression(
    `
      (?<=
        (?<${GROUP_QUOTE}>"|'|\`)\\s*
        ${prefix}
      )
      (?<${GROUP_MAIN}>%s)
      (?=
        ${suffix}
        \\s*\\k<${GROUP_QUOTE}>
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
  const prefix = options.prefix ? options.prefix : "";
  const suffix = options.suffix ? options.suffix : "";

  return [
    newPropertyAsStandaloneStringExpression(prefix, suffix),
  ];
}
