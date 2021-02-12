import type { ManglerMatch } from "../types";

import ManglerExpression from "../utils/mangler-expression.class";

const GROUP_NAME_ALL = "all";
const GROUP_NAME_LOCAL = "attribute";
const GROUP_NAME_PRE_MATCH = "pre";
const GROUP_NAME_POST_MATCH = "post";

/**
 * Get a regular expression to match individual attributes in a HTML element
 * string (e.g. `"data-foo"` in `<div id="foo" data-foo="bar"`).
 *
 * @param pattern The pattern.
 * @returns A {@see RegExp} to match `pattern` in an element.
 */
function getClassRegExp(pattern: string): RegExp {
  const expr = `(?<=\\s)(?<${GROUP_NAME_LOCAL}>${pattern})(?=\\s|\\=|\\>)`;
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
    if (match.groups) {
      results.push(match.groups[groupName]);
    }
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
      (?<${GROUP_NAME_ALL}>
        (?<${GROUP_NAME_PRE_MATCH}>[^\\>]*)
        %s
        (?<${GROUP_NAME_POST_MATCH}>\\s|\\=|\\>)
      )
    `.replace(/\s/g, ""),
    (pattern: string, match: ManglerMatch): string[] => {
      const s = match.getNamedGroup(GROUP_NAME_ALL);
      const regExp = getClassRegExp(pattern);
      return findInstancesOfGroupIn(s, regExp, GROUP_NAME_LOCAL);
    },
    ManglerExpression.matchReplacerBy(`
      $<${GROUP_NAME_PRE_MATCH}>%s$<${GROUP_NAME_POST_MATCH}>
    `.replace(/\s/g, "")),
  ),
];

export default expressions;
