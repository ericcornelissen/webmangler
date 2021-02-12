import type { ManglerMatch } from "../types";

import ManglerExpression from "../utils/mangler-expression.class";

const GROUP_ALL = "all";
const GROUP_ATTRIBUTE = "attribute";
const GROUP_QUOTE = "quote";

const SELECTOR_REQUIRED_BEFORE = "\\[\\s*";
const SELECTOR_REQUIRED_AFTER = "\\s*(?:\\]|\\=|\\|=|\\~=|\\^=|\\$=|\\*=)";

/**
 * Get a regular expression to match individual attributes selectors in a query
 * selector string (e.g. `"data-foo"` in `div[data-foo]`).
 *
 * @param pattern The pattern.
 * @returns A {@see RegExp} to match `pattern` in a query selector string.
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
    if (match.groups) {
      results.push(match.groups[groupName]);
    }
  }

  return results;
}

const expressions: ManglerExpression[] = [
  // Attribute selector, e.g. (with prefix "data-"):
  //  `querySelector\("div[(data-foo)]"\)`
  //  `querySelector\("[(data-foo)]"\)`
  //  `querySelector\("[(data-foo)="bar"]"\)`
  //  `querySelector\("[(data-foo)|="bar"]"\)`
  //  `querySelector\("[(data-foo)~="bar"]"\)`
  //  `querySelector\("[(data-foo)^="bar"]"\)`
  //  `querySelector\("[(data-foo)$="bar"]"\)`
  //  `querySelector\("[(data-foo)*="bar"]"\)`
  new ManglerExpression(
    `
      (?<=(?<${GROUP_QUOTE}>"|'|\`))
      (?<${GROUP_ALL}>
        (?:.(?!\\k<${GROUP_QUOTE}>)|\\\\k<${GROUP_QUOTE}>)*
        (?:${SELECTOR_REQUIRED_BEFORE})
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

  // Attribute manipulation, e.g. (with prefix "data-"):
  //  `$el.getAttribute\("(data-praise)"\)`
  //  `$el.removeAttribute\("(data-the)"\)`
  //  `$el.setAttribute\("(data-sun)", "value"\)`
  new ManglerExpression(
    `
      (?<=(?<${GROUP_QUOTE}>"|'|\`)\\s*)
      (?<${GROUP_ATTRIBUTE}>%s)
      (?=\\s*\\k<${GROUP_QUOTE}>)
    `.replace(/\s/g, ""),
    ManglerExpression.matchParserForGroup(GROUP_ATTRIBUTE),
    ManglerExpression.matchReplacerBy("%s"),
  ),
];

export default expressions;
