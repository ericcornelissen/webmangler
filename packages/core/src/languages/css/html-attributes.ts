import type { MangleExpression } from "../../types";

import { SingleGroupMangleExpression } from "../utils/mangle-expressions";

const GROUP_ATTRIBUTE = "main";

const SELECTOR_REQUIRED_BEFORE = "\\[\\s*";
const SELECTOR_REQUIRED_AFTER = "\\s*(?:\\]|\\=|\\|=|\\~=|\\^=|\\$=|\\*=)";

const expressions: MangleExpression[] = [
  // Attribute selectors, e.g. (with prefix "data-"):
  //  `[(data-foo)]`
  //  `[(data-foo)=bar]`
  //  `[(data-foo)|=bar]`
  //  `[(data-foo)~=bar]`
  //  `[(data-foo)^=bar]`
  //  `[(data-foo)$=bar]`
  //  `[(data-foo)*=bar]`
  new SingleGroupMangleExpression(
    `
      (?<=${SELECTOR_REQUIRED_BEFORE})
      (?<${GROUP_ATTRIBUTE}>%s)
      (?=${SELECTOR_REQUIRED_AFTER})
    `,
    GROUP_ATTRIBUTE,
  ),

  // Attribute usage, e.g. (with prefix "data-"):
  //  `attr\((data-foo)\);`
  //  `attr\((data-foo) number\);`
  //  `attr\((data-foo), 0\);`
  //  `attr\((data-foo) url, "https://www.example.com/"\);`
  new SingleGroupMangleExpression(
    `
      (?<=attr\\s*\\(\\s*)
      (?<${GROUP_ATTRIBUTE}>%s)
      (?=(\\s+([a-zA-Z]+|%))?\\s*(,|\\)))
    `,
    GROUP_ATTRIBUTE,
  ),
];

export default expressions;
