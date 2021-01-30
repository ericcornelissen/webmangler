import ManglerExpression from "../utils/mangler-expression.class";

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
  new ManglerExpression(
    "\\.(%s)(?=\\{|\\,|\\.|\\#|\\[|\\:|\\)|\\>|\\+|\\~|\\s)",
    ManglerExpression.matchParserForIndex(1),
    ManglerExpression.matchReplacerBy(".%s"),
  ),
];

export default expressions;
