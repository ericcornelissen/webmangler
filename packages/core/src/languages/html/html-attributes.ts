import type { MangleExpression } from "../../types";

import { NestedGroupExpression } from "../utils/mangle-expressions";

const GROUP_ATTRIBUTE = "main";

const expressions: MangleExpression[] = [
  // HTML attributes, e.g. (with prefix "data-"):
  //  `<div (data-foo)="bar"></div>`
  //  `<div id="xxx" (data-foo)="bar"></div>`
  //  `<div (data-foo)="bar" id="yyy"></div>`
  //  `<div (data-foo)="bar" (data-bar)="foo"></div>`
  ...["\"", "'"].map((quote) => new NestedGroupExpression(
    `
      (?<=\\<\\s*[a-zA-Z]+\\s+)
      (?<${GROUP_ATTRIBUTE}>
        (?:
          [^>${quote}]+
          ${quote}[^${quote}]*${quote}
          \\s
        )*
        %s
        (?:
          (?:\\=|\\s)
          [^>]*
        )?
      )
      (?=\\>)
    `,
    `
      (?<=\\s|^)
      (?<${GROUP_ATTRIBUTE}>%s)
      (?=\\=|\\s|$)
    `,
    GROUP_ATTRIBUTE,
  )),
];

export default expressions;
