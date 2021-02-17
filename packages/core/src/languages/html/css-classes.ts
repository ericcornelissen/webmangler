import type { ManglerExpression } from "../../types";

import { SingleGroupManglerExpression } from "../utils/mangler-expressions";

const GROUP_NAME_MAIN = "main";

const pattern: ManglerExpression[] = [
  // Finds e.g., "cls-a" and "cls-b" in  `<div class="cls-a ignore cls-b">`
  ...["\"", "'"].map((quote) => new SingleGroupManglerExpression(
    `
      (?<=
        \\sclass\\s*=\\s*${quote}
        ([^${quote}]*\\s)?
      )
      (?<${GROUP_NAME_MAIN}>%s)
      (?=\\s|${quote})
    `,
    GROUP_NAME_MAIN,
  )),
];

export default pattern;
