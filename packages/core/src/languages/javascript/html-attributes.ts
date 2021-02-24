import type { MangleExpression } from "../../types";

import { SingleGroupMangleExpression } from "../utils/mangle-expressions";

const GROUP_ATTRIBUTE = "attribute";
const GROUP_QUOTE = "quote";

const SELECTOR_REQUIRED_BEFORE = "\\[\\s*";
const SELECTOR_REQUIRED_AFTER = "\\s*(?:\\]|\\=|\\|=|\\~=|\\^=|\\$=|\\*=)";

const expressions: MangleExpression[] = [
  // Attribute selector, e.g. (with prefix "data-"):
  //  `querySelector\("div[(data-foo)]"\)`
  //  `querySelector\("[(data-foo)]"\)`
  //  `querySelector\("[(data-foo)="bar"]"\)`
  //  `querySelector\("[(data-foo)|="bar"]"\)`
  //  `querySelector\("[(data-foo)~="bar"]"\)`
  //  `querySelector\("[(data-foo)^="bar"]"\)`
  //  `querySelector\("[(data-foo)$="bar"]"\)`
  //  `querySelector\("[(data-foo)*="bar"]"\)`
  ...["\"", "'", "`"].map((quote) => new SingleGroupMangleExpression(
    `
      (?<=
        ${quote}[^${quote}]*
        ${SELECTOR_REQUIRED_BEFORE}
      )
      (?<${GROUP_ATTRIBUTE}>%s)
      (?=${SELECTOR_REQUIRED_AFTER})
    `,
    GROUP_ATTRIBUTE,
  )),

  // Attribute manipulation, e.g. (with prefix "data-"):
  //  `$el.getAttribute\("(data-praise)"\)`
  //  `$el.removeAttribute\("(data-the)"\)`
  //  `$el.setAttribute\("(data-sun)", "value"\)`
  new SingleGroupMangleExpression(
    `
      (?<=(?<${GROUP_QUOTE}>"|'|\`)\\s*)
      (?<${GROUP_ATTRIBUTE}>%s)
      (?=\\s*\\k<${GROUP_QUOTE}>)
    `,
    GROUP_ATTRIBUTE,
  ),
];

export default expressions;
