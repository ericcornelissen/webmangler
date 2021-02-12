import ManglerExpression from "../utils/mangler-expression.class";

const SELECTOR_REQUIRED_BEFORE = "\\[\\s*";
const SELECTOR_REQUIRED_AFTER = "\\s*(?:\\]|\\=|\\|=|\\~=|\\^=|\\$=|\\*=)";

const expressions: ManglerExpression[] = [
  // Attribute selectors, e.g. (with prefix "data-"):
  //  `[(data-foo)]`
  //  `[(data-foo)=bar]`
  //  `[(data-foo)|=bar]`
  //  `[(data-foo)~=bar]`
  //  `[(data-foo)^=bar]`
  //  `[(data-foo)$=bar]`
  //  `[(data-foo)*=bar]`
  new ManglerExpression(
    `(?<=${SELECTOR_REQUIRED_BEFORE})(%s)(?=${SELECTOR_REQUIRED_AFTER})`,
    ManglerExpression.matchParserForIndex(1),
    ManglerExpression.matchReplacerBy("%s"),
  ),

  // Attribute usage, e.g. (with prefix "data-"):
  //  `attr\((data-foo)\);`
  //  `attr\((data-foo) number\);`
  //  `attr\((data-foo), 0\);`
  //  `attr\((data-foo) url, "https://www.example.com/"\);`
  new ManglerExpression(
    "(?<=attr\\s*\\(\\s*)(%s)(?=(\\s+([a-zA-Z]+|%))?\\s*(,|\\)))",
    ManglerExpression.matchParserForIndex(1),
    ManglerExpression.matchReplacerBy("%s"),
  ),
];

export default expressions;
