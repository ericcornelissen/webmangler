import type { ManglerExpression } from "../types";

import { ParallelManglerExpression } from "../utils/mangler-expressions";

const GROUP_ATTRIBUTE = "attribute";
const GROUP_QUOTE = "quote";

const SELECTOR_REQUIRED_BEFORE = "\\[\\s*";
const SELECTOR_REQUIRED_AFTER = "\\s*(?:\\]|\\=|\\|=|\\~=|\\^=|\\$=|\\*=)";

const expressions: ManglerExpression[] = [
  // Attribute selector, e.g. (with prefix "data-"):
  //  `querySelector\("div[(data-foo)]"\)`
  //  `querySelector\("[(data-foo)]"\)`
  //  `querySelector\("[(data-foo)="bar"]"\)`
  //  `querySelector\("[(data-foo)|="bar"]"\)`
  //  `querySelector\("[(data-foo)~="bar"]"\)`
  //  `querySelector\("[(data-foo)^="bar"]"\)`
  //  `querySelector\("[(data-foo)$="bar"]"\)`
  //  `querySelector\("[(data-foo)*="bar"]"\)`
  ...["\"", "'", "`"].map((quote) => new ParallelManglerExpression(
    `
      (?<=
        ${quote}[^${quote}]*
        ${SELECTOR_REQUIRED_BEFORE}
      )
      (?<${GROUP_ATTRIBUTE}>%s)
      (?=${SELECTOR_REQUIRED_AFTER})
    `.replace(/\s/g, ""),
    GROUP_ATTRIBUTE,
    "%s",
  )),

  // Attribute manipulation, e.g. (with prefix "data-"):
  //  `$el.getAttribute\("(data-praise)"\)`
  //  `$el.removeAttribute\("(data-the)"\)`
  //  `$el.setAttribute\("(data-sun)", "value"\)`
  new ParallelManglerExpression(
    `
      (?<=(?<${GROUP_QUOTE}>"|'|\`)\\s*)
      (?<${GROUP_ATTRIBUTE}>%s)
      (?=\\s*\\k<${GROUP_QUOTE}>)
    `.replace(/\s/g, ""),
    GROUP_ATTRIBUTE,
    "%s",
  ),
];

export default expressions;
