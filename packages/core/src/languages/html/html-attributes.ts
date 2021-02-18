import type { ManglerExpression } from "../../types";

import { NestedGroupExpression } from "../utils/mangler-expressions";

const GROUP_ATTRIBUTE = "main";

const expressions: ManglerExpression[] = [
  // HTML attributes, e.g. (with prefix "data-"):
  //  `<div (data-foo)="bar"></div>`
  //  `<div id="xxx" (data-foo)="bar"></div>`
  //  `<div (data-foo)="bar" id="yyy"></div>`
  //  `<div (data-foo)="bar" (data-bar)="foo"></div>`
  new NestedGroupExpression(
    `
      (?<=\\<\\s*[a-zA-Z]+\\s+)
      (?<${GROUP_ATTRIBUTE}>
        (?:
          [^>"']+
          (?:
            "[^"]*"
            |
            '[^']*'
          )
          \\s
        )*
        (?:%s)
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
  ),

  // new SingleGroupManglerExpression(
  //   `
  //     (?<=
  //       \\<\\s*[a-zA-Z]+\\s+
  //       (?:
  //         (?:
  //           [^>"']+
  //           (?:\\=\\s*(?:"[^"]*"|'[^']*'))?
  //         )\\s+
  //       )*
  //     )
  //     (?<${GROUP_ATTRIBUTE}>%s)
  //     (?=${SELECTOR_REQUIRED_AFTER})
  //   `,
  //   GROUP_ATTRIBUTE,
  // ),
];

export default expressions;
