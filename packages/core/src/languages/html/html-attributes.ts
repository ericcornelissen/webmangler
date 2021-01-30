import ManglerExpression from "../utils/mangler-expression.class";

const expressions: ManglerExpression[] = [
  // e.g.
  //  <div data-foo="bar">
  //  <div id="a" data-foo="bar">
  //  <div data-foo="bar" id="a" >
  new ManglerExpression(
    "(<[^>]*\\s)(%s)([^>]*>)",
    ManglerExpression.matchParserForIndex(2),
    ManglerExpression.matchReplacerBy("$1%s$3"),
  ),
];

export default expressions;
