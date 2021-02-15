import type { ManglerExpression } from "../types";

import { SingleGroupManglerExpression } from "../utils/mangler-expressions";

const GROUP_NAME_QUOTE = "q";
const GROUP_NAME_PATTER = "main";

const pattern: ManglerExpression[] = [
  // matches e.g. `el.classList.add("foo")`
  new SingleGroupManglerExpression(
    `
      (?<=(?<${GROUP_NAME_QUOTE}>"|'|\`)\\s*)
      (?<${GROUP_NAME_PATTER}>%s)
      (?=\\s*\\k<${GROUP_NAME_QUOTE}>)
    `,
    GROUP_NAME_PATTER,
    "%s",
  ),

  // matches e.g. `document.querySelectorAll(".foo")`
  ...["\"", "'", "`"].map((quote) => new SingleGroupManglerExpression(
    `
      (?<=${quote}[^${quote}]*)
      \\.(?<${GROUP_NAME_PATTER}>%s)
      (?=${quote}|\\s|\\.|\\#|\\[|\\>|\\+|\\~)
    `,
    GROUP_NAME_PATTER,
    ".%s",
  )),
];

export default pattern;
