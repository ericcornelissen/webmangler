import { ManglerMatch } from "../types";

import ManglerExpression from "../utils/mangler-expression.class";

const GROUP_NAME_QUOTE = "q";
const GROUP_NAME_PRE_PATTERN = "pre";
const GROUP_NAME_PATTER = "main";
const GROUP_NAME_POST_PATTER = "post";

const pattern: ManglerExpression[] = [
  // matches e.g. `el.classList.add("foo")`
  new ManglerExpression(
    `
      (?<${GROUP_NAME_PRE_PATTERN}>(?<${GROUP_NAME_QUOTE}>"|'|\`)\\s*)
      (?<${GROUP_NAME_PATTER}>%s)
      (?<${GROUP_NAME_POST_PATTER}>\\s*\\k<${GROUP_NAME_QUOTE}>)
    `.replace(/\s/g, ""),
    ManglerExpression.matchParserForGroup(GROUP_NAME_PATTER),
    ManglerExpression.matchReplacerBy(
      `$<${GROUP_NAME_PRE_PATTERN}>%s$<${GROUP_NAME_POST_PATTER}>`,
    ),
  ),

  // matches e.g. `document.querySelectorAll(".foo")`
  new ManglerExpression(
    `
      (?<${GROUP_NAME_QUOTE}>"|'|\`)
      (?<${GROUP_NAME_PRE_PATTERN}>(?:.(?!\\k<${GROUP_NAME_QUOTE}>))*\\.)
      (?<${GROUP_NAME_PATTER}>%s)
      (
        ?<${GROUP_NAME_POST_PATTER}>
        \\k<${GROUP_NAME_QUOTE}>|\\s|\\.|\\#|\\[|\\>|\\+|\\~
      )
    `.replace(/\s/g, ""),
    (pattern: string, match: ManglerMatch): string[] => {
      const results: string[] = [];

      const prePatternClasses = match.getNamedGroup(GROUP_NAME_PRE_PATTERN);
      const lastPatternMatch = match.getNamedGroup(GROUP_NAME_PATTER);
      const s = `${prePatternClasses}${lastPatternMatch}`;
      const regexp = new RegExp(`\\.(${pattern})`, "gm");
      let match2: RegExpExecArray | null = null;
      while ((match2 = regexp.exec(s)) !== null) {
        results.push(match2[1]);
      }

      return results;
    },
    ManglerExpression.matchReplacerBy(
      `
        $<${GROUP_NAME_QUOTE}>
        $<${GROUP_NAME_PRE_PATTERN}>
        %s
        $<${GROUP_NAME_POST_PATTER}>
      `.replace(/\s/g, ""),
    ),
  ),
];

export default pattern;
