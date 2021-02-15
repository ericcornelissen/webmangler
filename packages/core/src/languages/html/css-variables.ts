import type { ManglerExpression } from "../types";

import { ParallelManglerExpression } from "../utils/mangler-expressions";

const GROUP_MATCHED_VARIABLE_NAME = "main";

const expressions: ManglerExpression[] = [
  // CSS variable declarations in style attributes, e.g.:
  //  `<div style="--(foo): #000;"></div>`
  new ParallelManglerExpression(
    `
      (?<=
        style\\s*=\\s*
        ("[^"]*|'[^']*)
      )
      --(?<${GROUP_MATCHED_VARIABLE_NAME}>%s)
      (?=\\s*:)
    `.replace(/\s/g, ""),
    GROUP_MATCHED_VARIABLE_NAME,
    "--%s",
  ),

  // CSS variable declarations in style attributes, e.g.:
  //  `<div style="color: var\(--(foo)\)"></div>`
  new ParallelManglerExpression(
    `
      (?<=
        style\\s*=\\s*
        ("[^"]*|'[^']*)
        var\\s*\\(\\s*
      )
      --(?<${GROUP_MATCHED_VARIABLE_NAME}>%s)
      (?=\\s*(,|\\)))
    `.replace(/\s/g, ""),
    GROUP_MATCHED_VARIABLE_NAME,
    "--%s",
  ),
];

export default expressions;
