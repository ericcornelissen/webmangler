import type { ManglerExpression } from "../types";

import { SingleGroupManglerExpression } from "../utils/mangler-expressions";

const GROUP_QUOTE = "quote";
const GROUP_VARIABLE = "main";

const expressions: ManglerExpression[] = [
  new SingleGroupManglerExpression(
    `
      (?<=(?<${GROUP_QUOTE}>"|'|\`)\\s*)
      --(?<${GROUP_VARIABLE}>%s)
      (?=\\s*\\k<${GROUP_QUOTE}>)
    `,
    GROUP_VARIABLE,
    "--%s",
  ),
];

export default expressions;
