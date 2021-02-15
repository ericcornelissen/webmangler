import type { ManglerExpression } from "../types";

import { ParallelManglerExpression } from "../utils/mangler-expressions";

const GROUP_VARIABLE = "main";

const expressions: ManglerExpression[] = [
  // CSS variable declarations, e.g.:
  //  `--(foo): 'bar';`
  //  `--(foo) : 'bar;`
  new ParallelManglerExpression(
    `--(?<${GROUP_VARIABLE}>%s)(?=\\s*:)`,
    GROUP_VARIABLE,
    "--%s",
  ),

  // CSS variable usage, e.g.:
  //  `var(--foo);`
  //  `var(--foo, 'bar');`
  //  `var ( --foo );`
  new ParallelManglerExpression(
    `(?<=var\\s*\\(\\s*)--(?<${GROUP_VARIABLE}>%s)(?=\\s*(,|\\)))`,
    GROUP_VARIABLE,
    "--%s",
  ),
];

export default expressions;
