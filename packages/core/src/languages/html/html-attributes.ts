import type { ManglerMatch } from "../types";

import ManglerExpression from "../utils/mangler-expression.class";

const GROUP_ALL = "all";
const GROUP_ATTRIBUTE = "attribute";
const GROUP_QUOTE = "quote";

const SELECTOR_REQUIRED_BEFORE = "\\s";
const SELECTOR_REQUIRED_AFTER = "\\s|\\=|\\>";

/**
 * Get a regular expression to match individual attributes in a HTML element
 * string (e.g. `"data-foo"` in `<div id="foo" data-foo="bar"`).
 *
 * @param pattern The pattern.
 * @returns A {@see RegExp} to match `pattern` in an element.
 */
function getAttributeRegExp(pattern: string): RegExp {
  const expr = `
    (?<=${SELECTOR_REQUIRED_BEFORE})
    (?<${GROUP_ATTRIBUTE}>${pattern})
    (?=${SELECTOR_REQUIRED_AFTER})
  `.replace(/\s/g, "");

  return new RegExp(expr, "gm");
}

/**
 * Match a string against a regular expression and return, for each match, the
 * value of a named group.
 *
 * @param s The source string.
 * @param regExp The {@link RegExp} to use.
 * @param groupName The name of the group to return.
 * @returns The values of `groupName` of each match.
 */
function findInstancesOfGroupIn(
  s: string,
  regExp: RegExp,
  groupName: string,
): string[] {
  const results: string[] = [];

  let match: RegExpExecArray | null = null;
  while ((match = regExp.exec(s)) !== null) {
    const groups = match.groups as { [key: string]: string; };
    results.push(groups[groupName]);
  }

  return results;
}

const expressions: ManglerExpression[] = [
  // HTML attributes, e.g. (with prefix "data-"):
  //  `<div (data-foo)="bar"></div>`
  //  `<div id="xxx" (data-foo)="bar"></div>`
  //  `<div (data-foo)="bar" id="yyy"></div>`
  //  `<div (data-foo)="bar" (data-bar)="foo"></div>`
  new ManglerExpression(
    `
      (?<=\\<\\s*[a-zA-Z]+(?=\\s))
      (?<${GROUP_ALL}>
        (?:
          [^\\>]
          |
          (?<${GROUP_QUOTE}>"|')
            (.(?!\\k<${GROUP_QUOTE}>))*
            \\>
            (.(?<!\\k<${GROUP_QUOTE}>))*
          (\\k<${GROUP_QUOTE}>)
        )*
        (?<=${SELECTOR_REQUIRED_BEFORE})
        (?<${GROUP_ATTRIBUTE}>%s)
        (?:${SELECTOR_REQUIRED_AFTER})
      )
    `.replace(/\s/g, ""),
    (pattern: string, match: ManglerMatch): string[] => {
      const s = match.getNamedGroup(GROUP_ALL);
      const regExp = getAttributeRegExp(pattern);
      return findInstancesOfGroupIn(s, regExp, GROUP_ATTRIBUTE);
    },
    (replaceStr: string, match: ManglerMatch): string => {
      const s = match.getNamedGroup(GROUP_ALL);
      const attr = match.getNamedGroup(GROUP_ATTRIBUTE);
      const regExp = getAttributeRegExp(attr);
      return s.replace(regExp, replaceStr);
    },
  ),
];

export default expressions;
