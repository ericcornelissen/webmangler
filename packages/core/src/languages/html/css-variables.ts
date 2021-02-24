import type { MangleExpression } from "../../types";

import { SingleGroupMangleExpression } from "../utils/mangle-expressions";

const GROUP_MATCHED_VARIABLE_NAME = "main";

const expressions: MangleExpression[] = [
  // CSS variable declarations in style attributes, e.g.:
  //  `<div style="--(foo): #000;"></div>`
  new SingleGroupMangleExpression(
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
  new SingleGroupMangleExpression(
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
