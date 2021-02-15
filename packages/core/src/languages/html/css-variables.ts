import type { ManglerExpression, ManglerMatch } from "../types";

import { SerialManglerExpression } from "../utils/mangler-expressions";


const GROUP_ATTRIBUTE_VALUE = "all";
const GROUP_MATCHED_VARIABLE_NAME = "main";
const GROUP_QUOTE = "quote";

/**
 * Get a Regular Expression to match individual CSS variables declarations in a
 * HTML style attribute value string (e.g. `"foo"` in `style="--foo: #000;"`).
 *
 * @param pattern The variable pattern.
 * @returns A {@see RegExp} to match the `pattern` in style attribute values.
 */
function getDeclarationRegExp(pattern: string): RegExp {
  const expr = `(?<=--)(${pattern})(?=\\s*:)`;
  return new RegExp(expr, "gm");
}

/**
 * Get a Regular Expression to match individual CSS variables usage in a
 * HTML style attribute value string (e.g. `"foo"` in `style="var(--foo)"`).
 *
 * @param pattern The variable pattern.
 * @returns A {@see RegExp} to match the `pattern` in style attribute values.
 */
function getUsageRegExp(pattern: string): RegExp {
  const expr = `(?<=var\\s*\\(\\s*--)(${pattern})(?=\\s*(,|\\)))`;
  return new RegExp(expr, "gm");
}

/**
 * Find and return instances of a Regular Expression in a string.
 *
 * @param s The source string.
 * @param regExp The {@link RegExp} to use.
 * @returns The values at index `1` of each match.
 */
function findInstancesIn(
  s: string,
  regExp: RegExp,
): string[] {
  const results: string[] = [];

  let match: RegExpExecArray | null = null;
  while ((match = regExp.exec(s)) !== null) {
    results.push(match[1]);
  }

  return results;
}

const expressions: ManglerExpression[] = [
  // CSS variable declarations in style attributes, e.g.:
  //  `<div style="--(foo): #000;"></div>`
  new SerialManglerExpression(
    `
      (?<=style\\s*=\\s*)
      (?<${GROUP_QUOTE}>"|')
      (?<${GROUP_ATTRIBUTE_VALUE}>
        (?:.(?!\\k<${GROUP_QUOTE}>))*
        --(?<${GROUP_MATCHED_VARIABLE_NAME}>%s)\\s*:
      )
    `.replace(/\s/g, ""),
    (pattern: string, match: ManglerMatch): string[] => {
      const s = match.getNamedGroup(GROUP_ATTRIBUTE_VALUE);
      const regExp = getDeclarationRegExp(pattern);
      return findInstancesIn(s, regExp);
    },
    (replaceBy: string, match: ManglerMatch): string => {
      const s = match.getMatchedStr();
      const variableName = match.getNamedGroup(GROUP_MATCHED_VARIABLE_NAME);
      const regExp = getDeclarationRegExp(variableName);
      return s.replace(regExp, replaceBy);
    },
  ),

  // CSS variable declarations in style attributes, e.g.:
  //  `<div style="color: var\(--(foo)\)"></div>`
  new SerialManglerExpression(
    `
      (?<=style\\s*=\\s*)
      (?<${GROUP_QUOTE}>"|')
      (?<${GROUP_ATTRIBUTE_VALUE}>
        (?:.(?!\\k<${GROUP_QUOTE}>))*
        var\\s*\\(\\s*--(?<${GROUP_MATCHED_VARIABLE_NAME}>%s)\\s*(,|\\))
      )
    `.replace(/\s/g, ""),
    (pattern: string, match: ManglerMatch): string[] => {
      const s = match.getNamedGroup(GROUP_ATTRIBUTE_VALUE);
      const regExp = getUsageRegExp(pattern);
      return findInstancesIn(s, regExp);
    },
    (replaceBy: string, match: ManglerMatch): string => {
      const s = match.getMatchedStr();
      const variableName = match.getNamedGroup(GROUP_MATCHED_VARIABLE_NAME);
      const regExp = getUsageRegExp(variableName);
      return s.replace(regExp, replaceBy);
    },
  ),
];

export default expressions;
