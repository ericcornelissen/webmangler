import type { ManglerExpression } from "../types";

import { ParallelManglerExpression } from "../utils/mangler-expressions";

const GROUP_NAME_MAIN = "main";

const pattern: ManglerExpression[] = [
  // Finds e.g., "cls-a" and "cls-b" in  `<div class="cls-a ignore cls-b">`
  ...["\"", "'"].map((quote) => new ParallelManglerExpression(
    `
      (?<=
        class\\s*=\\s*${quote}
        ([^${quote}]*\\s)?
      )
      (?<${GROUP_NAME_MAIN}>%s)
      (?=\\s|${quote})
    `.replace(/\s/g, ""),
    GROUP_NAME_MAIN,
    "%s",
  )),
];

export default pattern;
