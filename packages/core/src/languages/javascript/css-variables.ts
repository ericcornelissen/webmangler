import type { ManglerExpression } from "../types";

import { ParallelManglerExpression } from "../utils/mangler-expressions";

const GROUP_QUOTE = "quote";
const GROUP_VARIABLE = "main";

const expressions: ManglerExpression[] = [
  new ParallelManglerExpression(
    `
      (?<=(?<${GROUP_QUOTE}>"|'|\`)\\s*)
      --(?<${GROUP_VARIABLE}>%s)
      (?=\\s*\\k<${GROUP_QUOTE}>)
    `.replace(/\s/g, ""),
    GROUP_VARIABLE,
    "--%s",
  ),
];

export default expressions;
