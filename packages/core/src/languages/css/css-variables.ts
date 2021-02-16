import type { ManglerExpression } from "../../types";

import { SingleGroupManglerExpression } from "../utils/mangler-expressions";

const GROUP_VARIABLE = "main";

const expressions: ManglerExpression[] = [
  // CSS variable declarations, e.g.:
  //  `--(foo): 'bar';`
  //  `--(foo) : 'bar;`
  new SingleGroupManglerExpression(
    `
      (?<=--)
      (?<${GROUP_VARIABLE}>%s)
      (?=\\s*:)
    `,
    GROUP_VARIABLE,
  ),

  // CSS variable usage, e.g.:
  //  `var(--foo);`
  //  `var(--foo, 'bar');`
  //  `var ( --foo );`
  new SingleGroupManglerExpression(
    `
      (?<=
        var\\s*\\(\\s*
        --
      )
      (?<${GROUP_VARIABLE}>%s)
      (?=\\s*(,|\\)))
    `,
    GROUP_VARIABLE,
  ),
];

export default expressions;
