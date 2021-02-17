import type { ManglerExpression } from "../../types";

import { SingleGroupManglerExpression } from "../utils/mangler-expressions";

const GROUP_CLASS = "main";

const expressions: ManglerExpression[] = [
  // e.g.
  //  `.(foo){ }`
  //  `.(foo) { }`
  //  `.(foo), .bar { }`
  //  `.(foo).bar { }`
  //  `.(foo)#bar { }`
  //  `.(foo)[data-value] { }`
  //  `.(foo):focus { }`
  //  `.(foo)::before { }`
  //  `.bar:not\(.(foo)\) { }`
  //  `.(foo)>div { }`
  //  `.(foo)+div { }`
  //  `.(foo)~div { }`
  //  `div > .(foo) { }`
  //  `div + .(foo) { }`
  //  `div ~ .(foo) { }`
  //  `#bar { } .(foo) { }`
  new SingleGroupManglerExpression(
    `
      (?<=\\.)
      (?<${GROUP_CLASS}>%s)
      (?=\\{|\\,|\\.|\\#|\\[|\\:|\\)|\\>|\\+|\\~|\\s)
    `,
    GROUP_CLASS,
  ),
];

export default expressions;
