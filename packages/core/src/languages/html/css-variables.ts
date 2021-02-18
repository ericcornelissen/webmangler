import type { ManglerExpression } from "../../types";

import { SingleGroupManglerExpression } from "../utils/mangler-expressions";

const GROUP_MATCHED_VARIABLE_NAME = "main";

const expressions: ManglerExpression[] = [
  // CSS variable declarations in style attributes, e.g.:
  //  `<div style="--(foo): #000;"></div>`
  new SingleGroupManglerExpression(
    `
      (?<=
        \\sstyle\\s*=\\s*
        ("[^"]*|'[^']*)
        --
      )
      (?<${GROUP_MATCHED_VARIABLE_NAME}>%s)
      (?=\\s*:)
    `,
    GROUP_MATCHED_VARIABLE_NAME,
  ),

  // CSS variable declarations in style attributes, e.g.:
  //  `<div style="color: var\(--(foo)\)"></div>`
  new SingleGroupManglerExpression(
    `
      (?<=
        style\\s*=\\s*
        ("[^"]*|'[^']*)
        var\\s*\\(\\s*
        --
      )
      (?<${GROUP_MATCHED_VARIABLE_NAME}>%s)
      (?=\\s*(,|\\)))
    `,
    GROUP_MATCHED_VARIABLE_NAME,
  ),
];

export default expressions;
