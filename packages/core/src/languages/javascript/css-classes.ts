import type { ManglerExpression } from "../types";

import { ParallelManglerExpression } from "../utils/mangler-expressions";

const GROUP_NAME_QUOTE = "q";
const GROUP_NAME_PATTER = "main";

const pattern: ManglerExpression[] = [
  // matches e.g. `el.classList.add("foo")`
  new ParallelManglerExpression(
    `
      (?<=(?<${GROUP_NAME_QUOTE}>"|'|\`)\\s*)
      (?<${GROUP_NAME_PATTER}>%s)
      (?=\\s*\\k<${GROUP_NAME_QUOTE}>)
    `.replace(/\s/g, ""),
    GROUP_NAME_PATTER,
    "%s",
  ),

  // matches e.g. `document.querySelectorAll(".foo")`
  ...["\"", "'", "`"].map((quote) => new ParallelManglerExpression(
    `
      (?<=${quote}[^${quote}]*)
      \\.(?<${GROUP_NAME_PATTER}>%s)
      (?=${quote}|\\s|\\.|\\#|\\[|\\>|\\+|\\~)
    `.replace(/\s/g, ""),
    GROUP_NAME_PATTER,
    ".%s",
  )),
];

export default pattern;
