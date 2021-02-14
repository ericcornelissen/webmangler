import type { ManglerMatch } from "../types";

import ManglerExpression from "../utils/mangler-expression.class";

const GROUP_NAME_ALL = "all";
const GROUP_NAME_MAIN = "main";
const GROUP_NAME_QUOTE = "quote";
const GROUP_NAME_LOCAL = "local";

/**
 * Get a regular expression to match individual classes in a HTML class
 * attribute value string (e.g. `"foo bar"` in `<div class="foo bar"`).
 *
 * @param q The quotes used in the HTML.
 * @param p The pattern.
 * @returns A {@see RegExp} to match `p` in class attribute values.
 */
function getClassRegExp(q: string, p: string): RegExp {
  const expr = `(?<=${q}|\\s)(?<${GROUP_NAME_LOCAL}>${p})(?=${q}|\\s)`;
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

const pattern: ManglerExpression[] = [
  // Finds e.g., "cls-a" and "cls-b" in  `<div class="cls-a ignore cls-b">`
  new ManglerExpression(
    `
      class
      (\\s*=\\s*)
      (?<${GROUP_NAME_ALL}>
        (?<${GROUP_NAME_QUOTE}>"|')
        (?:.(?!\\k<${GROUP_NAME_QUOTE}>))*
        (?<=\\s|\\k<${GROUP_NAME_QUOTE}>)(?<${GROUP_NAME_MAIN}>%s)
        (\\s|\\k<${GROUP_NAME_QUOTE}>)
      )
    `.replace(/\s/g, ""),
    (pattern: string, match: ManglerMatch): string[] => {
      const s = match.getNamedGroup(GROUP_NAME_ALL);
      const quote = match.getNamedGroup(GROUP_NAME_QUOTE);

      const regExp = getClassRegExp(quote, pattern);
      return findInstancesOfGroupIn(s, regExp, GROUP_NAME_LOCAL);
    },
    (replaceBy: string, match: ManglerMatch): string => {
      const s = match.getMatchedStr();
      const quote = match.getNamedGroup(GROUP_NAME_QUOTE);
      const className = match.getNamedGroup(GROUP_NAME_MAIN);

      const regExp = getClassRegExp(quote, className);
      return s.replace(regExp, replaceBy);
    },
  ),
];

export default pattern;
