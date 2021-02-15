import type { ManglerExpression } from "../types";

import { ParallelManglerExpression } from "../utils/mangler-expressions";

const GROUP_ID = "main";
const GROUP_QUOTE = "quote";

const CSS_SELECTOR_REQUIRED_AFTER = "\\{|\\,|\\.|\\#|\\[|\\:|\\)|\\>|\\+|\\~|\\s";

const JS_QUOTE_CAPTURING_GROUP_PATTERN = `(?<${GROUP_QUOTE}>"|'|\`)`;
const JS_QUOTE_MATCHING_PATTERN = `\\k<${GROUP_QUOTE}>`;

const expressions: ManglerExpression[] = [
  // Get element by ID, e.g. (with prefix "id-"):
  //  `getElementById\("foo"\);` <-- NO MATCH
  //  `getElementById\("(id-foo)"\);`
  //  `var id = "(id-foo)"; getElementById\(id\);`
  new ParallelManglerExpression(
    `
      (?<=${JS_QUOTE_CAPTURING_GROUP_PATTERN}\\s*)
      (?<${GROUP_ID}>%s)
      (?=\\s*${JS_QUOTE_MATCHING_PATTERN})
    `.replace(/\s/g, ""),
    GROUP_ID,
    "%s",
  ),

  // ID selector, e.g. (with prefix "id-"):
  //  `querySelector\("#foo"\);` <-- NO MATCH
  //  `querySelector\("#(id-foo)"\);`
  //  `querySelector\("div#(id-foo)"\);`
  //  `querySelector\(".foo#(id-bar)"\);`
  //  `querySelector\("#(id-foo).bar"\);`
  //  `querySelector\("#(id-foo) div"\);`
  //  `querySelector\("div #(id-foo)"\);`
  //  `querySelector\("#(id-bar) #(id-foo)"\);`
  //  `querySelector\("#(id-foo),div"\);`ManglerExpression
  //  `querySelector\("div,#(id-foo)"\);`
  //  `querySelector\("#(id-foo),#(id-bar)"\);`
  //  `querySelector\("#(id-foo)>div"\);`
  //  `querySelector\("div>#(id-foo)"\);`
  //  `querySelector\("#(id-foo)>#(id-bar)"\);`
  //  `querySelector\("#(id-foo)+div"\);`
  //  `querySelector\("div+#(id-foo)"\);`
  //  `querySelector\("#(id-foo)+#(id-bar)"\);`
  //  `querySelector\("#(id-foo)~div"\);`
  //  `querySelector\("div~#(id-foo)"\);`
  //  `querySelector\("#(id-foo)~#(id-bar)"\);`
  //  `querySelector\("#(id-foo)[data-bar]"\);`
  ...["\"", "'", "`"].map((quote) => new ParallelManglerExpression(
    `
      (?<=${quote}[^${quote}]*)
      #(?<${GROUP_ID}>%s)
      (?=${quote}|${CSS_SELECTOR_REQUIRED_AFTER})
    `.replace(/\s/g, ""),
    GROUP_ID,
    "#%s",
  )),
];

export default expressions;
