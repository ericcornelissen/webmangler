import type { MangleExpression } from "../../types";

import { SingleGroupMangleExpression } from "../utils/mangle-expressions";

const GROUP_QUOTE = "quote";
const GROUP_VARIABLE = "main";

const expressions: MangleExpression[] = [
  new SingleGroupMangleExpression(
    `
      (?<=
        (?<${GROUP_QUOTE}>"|'|\`)\\s*
        --
      )
      (?<${GROUP_VARIABLE}>%s)
      (?=\\s*\\k<${GROUP_QUOTE}>)
    `,
    GROUP_VARIABLE,
  ),
];

export default expressions;
