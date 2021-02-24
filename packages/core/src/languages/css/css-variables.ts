import type { MangleExpression } from "../../types";

import { SingleGroupMangleExpression } from "../utils/mangle-expressions";

const GROUP_VARIABLE = "main";

const expressions: MangleExpression[] = [
  // CSS variable declarations, e.g.:
  //  `--(foo): 'bar';`
  //  `--(foo) : 'bar;`
  new SingleGroupMangleExpression(
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
  new SingleGroupMangleExpression(
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
