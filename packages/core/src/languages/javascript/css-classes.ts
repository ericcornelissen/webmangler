import type { MangleExpression } from "../../types";

import { SingleGroupMangleExpression } from "../utils/mangle-expressions";

const GROUP_NAME_QUOTE = "q";
const GROUP_NAME_PATTER = "main";

const pattern: MangleExpression[] = [
  // matches e.g. `el.classList.add("foo")`
  new SingleGroupMangleExpression(
    `
      (?<=(?<${GROUP_NAME_QUOTE}>"|'|\`)\\s*)
      (?<${GROUP_NAME_PATTER}>%s)
      (?=\\s*\\k<${GROUP_NAME_QUOTE}>)
    `,
    GROUP_NAME_PATTER,
  ),

  // matches e.g. `document.querySelectorAll(".foo")`
  ...["\"", "'", "`"].map((quote) => new SingleGroupMangleExpression(
    `
      (?<=
        ${quote}[^${quote}]*
        \\.
      )
      (?<${GROUP_NAME_PATTER}>%s)
      (?=${quote}|\\{|\\,|\\.|\\#|\\[|\\:|\\)|\\>|\\+|\\~|\\s)
    `,
    GROUP_NAME_PATTER,
  )),
];

export default pattern;
