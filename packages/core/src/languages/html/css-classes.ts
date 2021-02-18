import type { ManglerExpression } from "../../types";

import { NestedGroupExpression } from "../utils/mangler-expressions";

const GROUP_NAME_MAIN = "main";

const pattern: ManglerExpression[] = [
  // Finds e.g., "cls-a" and "cls-b" in  `<div class="cls-a ignore cls-b">`
  ...["\"", "'"].map((quote) => new NestedGroupExpression(
    `
      (?<=class\\s*=\\s*${quote})
      (?<${GROUP_NAME_MAIN}>
        (?:[^${quote}]+\\s)?
        %s
        (?:\\s[^${quote}]+)?
      )
      (?=${quote})
    `,
    `
      (?<=\\s|^)
      (?<${GROUP_NAME_MAIN}>%s)
      (?=\\s|$)
    `,
    GROUP_NAME_MAIN,
  )),
];

export default pattern;
