import type { MangleExpression } from "../../types";

import { SingleGroupMangleExpression } from "../utils/mangle-expressions";

const GROUP_CLASS = "main";

const expressions: MangleExpression[] = [
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
  //  `.(foo)`
  new SingleGroupMangleExpression(
    `
      (?<!"[^"}]*|'[^'}]*)
      (?<=\\.)
      (?<${GROUP_CLASS}>%s)
      (?=\\{|\\,|\\.|\\#|\\[|\\:|\\)|\\>|\\+|\\~|\\s|$)
    `,
    GROUP_CLASS,
  ),
];

export default expressions;
