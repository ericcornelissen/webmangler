import ManglerExpression from "../utils/mangler-expression.class";

const expressions: ManglerExpression[] = [
  // ID selectors, e.g.:
  //  `(#foo){ }`
  //  `(#foo) { }`
  //  `(#foo), .bar { }`
  //  `(#foo).bar { }`
  //  `(#foo)#no-match { }`
  //  `(#foo)[data-value] { }`
  //  `(#foo):focus { }`
  //  `(#foo)::before { }`
  //  `div(#foo) { }`
  //  `div:not\((#foo)\) { }`
  //  `(#foo)>div { }`
  //  `(#foo)+div { }`
  //  `(#foo)~div { }`
  //  `div>(#foo) { }`
  //  `div+(#foo) { }`
  //  `div~(#foo) { }`
  //  `div { } (#foo) { }`
  new ManglerExpression(
    "\\#(%s)(?=\\{|\\,|\\.|\\#|\\[|\\:|\\)|\\>|\\+|\\~|\\s)",
    ManglerExpression.matchParserForIndex(1),
    ManglerExpression.matchReplacerBy("#%s"),
  ),
];

export default expressions;
