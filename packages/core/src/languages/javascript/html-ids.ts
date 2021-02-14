import type { ManglerMatch } from "../types";

import ManglerExpression from "../utils/mangler-expression.class";

const GROUP_AFTER = "post";
const GROUP_SELECTOR_STRING = "all";
const GROUP_BEFORE = "pre";
const GROUP_ID = "main";
const GROUP_QUOTE = "quote";

const CSS_SELECTOR_REQUIRED_AFTER = "\\{|\\,|\\.|\\#|\\[|\\:|\\)|\\>|\\+|\\~|\\s";

const JS_QUOTE_CAPTURING_GROUP_PATTERN = `(?<${GROUP_QUOTE}>"|'|\`)`;
const JS_QUOTE_MATCHING_PATTERN = `\\k<${GROUP_QUOTE}>`;

/**
 * Get a regular expression to match individual id selectors in a query
 * selector string (e.g. `"id-foo"` in `#id-foo`).
 *
 * @param pattern The pattern.
 * @returns A {@see RegExp} to match `pattern` in a query selector string.
 */
function getIdSelectorRegExp(pattern: string): RegExp {
  const expr = `
    (
      (?<=#)
      (?<${GROUP_ID}>${pattern})
      (?=${CSS_SELECTOR_REQUIRED_AFTER}|$)
    )
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
  // Get element by ID, e.g. (with prefix "id-"):
  //  `getElementById\("foo"\);` <-- NO MATCH
  //  `getElementById\("(id-foo)"\);`
  //  `var id = "(id-foo)"; getElementById\(id\);`
  new ManglerExpression(
    `
      (?<=${JS_QUOTE_CAPTURING_GROUP_PATTERN}\\s*)
      (?<${GROUP_ID}>%s)
      (?=\\s*${JS_QUOTE_MATCHING_PATTERN})
    `.replace(/\s/g, ""),
    ManglerExpression.matchParserForGroup(GROUP_ID),
    ManglerExpression.matchReplacerBy("%s"),
  ),

  // ID selector, e.g. (with prefix "id-"):
  //  `querySelector\("#foo"\);` <-- NO MATCH
  //  `querySelector\("#(id-foo)"\);`
  //  `querySelector\("div#(id-foo)"\);`
  //  `querySelector\(".foo#(id-bar)"\);`
  //  `querySelector\("#(id-foo).bar"\);`
  //  `querySelector\("#(id-foo) div"\);`
  //  `querySelector\("div #(id-foo)"\);`
  //  `querySelector\("#(id-bar) #(id-foo)"\);`
  //  `querySelector\("#(id-foo),div"\);`
  //  `querySelector\("div,#(id-foo)"\);`
  //  `querySelector\("#(id-foo),#(id-bar)"\);`
  //  `querySelector\("#(id-foo)>div"\);`
  //  `querySelector\("div>#(id-foo)"\);`
  //  `querySelector\("#(id-foo)>#(id-bar)"\);`
  //  `querySelector\("#(id-foo)+div"\);`
  //  `querySelector\("div+#(id-foo)"\);`
  //  `querySelector\("#(id-foo)+#(id-bar)"\);`
  //  `querySelector\("#(id-foo)~div"\);`
  //  `querySelector\("div~#(id-foo)"\);`
  //  `querySelector\("#(id-foo)~#(id-bar)"\);`
  //  `querySelector\("#(id-foo)[data-bar]"\);`
  new ManglerExpression(
    `
      (?<=${JS_QUOTE_CAPTURING_GROUP_PATTERN}\\s*)
      (?<${GROUP_SELECTOR_STRING}>
        (?<${GROUP_BEFORE}>
          (?:.(?!${JS_QUOTE_MATCHING_PATTERN}))*
        )
        #(?<${GROUP_ID}>%s)
      )
      (?=(
        ?<${GROUP_AFTER}>
        ${CSS_SELECTOR_REQUIRED_AFTER}|${JS_QUOTE_MATCHING_PATTERN}
      ))
    `.replace(/\s/g, ""),
    (pattern: string, match: ManglerMatch): string[] => {
      const s = match.getNamedGroup(GROUP_SELECTOR_STRING);
      const regExp = getIdSelectorRegExp(pattern);
      return findInstancesOfGroupIn(s, regExp, GROUP_ID);
    },
    (replaceStr: string, match: ManglerMatch): string => {
      const s = match.getMatchedStr();
      const pattern = match.getNamedGroup(GROUP_ID);
      const regExp = getIdSelectorRegExp(pattern);
      return s.replace(regExp, replaceStr);
    },
  ),
];

export default expressions;
