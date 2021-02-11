import ManglerExpression from "../utils/mangler-expression.class";

const expressions: ManglerExpression[] = [
  // Attribute selectors, e.g.:
  //  `[(data-foo)]`
  //  `[(data-foo)=bar]`
  //  `[(data-foo)~=bar]`
  //  `[(data-foo)^=bar]`
  //  `[(data-foo)$=bar]`
  //  `[(data-foo)*=bar]`
  //  `[(data-foo)|=bar]`
  new ManglerExpression(
    "(?<=\\[\\s*)(%s)(?=\\s*(\\]|\\=|\\~|\\^|\\$|\\*|\\|))",
    ManglerExpression.matchParserForIndex(1),
    ManglerExpression.matchReplacerBy("%s"),
  ),

  // Attribute usage, e.g.:
  //  `attr(data-foo);`
  //  `attr(data-foo number);`
  //  `attr(data-foo, 0);`
  //  `attr(data-foo url, "https://www.example.com/");`
  new ManglerExpression(
    "(?<=attr\\s*\\(\\s*)(%s)(?=(\\s+([a-zA-Z]+|%))?\\s*(,|\\)))",
    ManglerExpression.matchParserForIndex(1),
    ManglerExpression.matchReplacerBy("%s"),
  ),
];

export default expressions;
