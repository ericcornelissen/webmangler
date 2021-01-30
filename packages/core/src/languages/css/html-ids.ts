import ManglerExpression from "../utils/mangler-expression.class";

const expressions: ManglerExpression[] = [
  // e.g.
  //  #(foo)
  //  #(foo)({)
  //  #(foo)( ){
  //  #(foo)(,) .bar {
  //  #(foo)(.)bar {
  //  #(foo)([)data-value] {
  //  #(foo)(:)focus {
  //  #(foo)(:):before {
  //  .bar:not\(#(foo)(\)) {
  new ManglerExpression(
    "\\#(%s)([{\\s,\\.\\[\\:\\)])",
    ManglerExpression.matchParserForIndex(1),
    ManglerExpression.matchReplacerBy("#%s$2"),
  ),
];

export default expressions;
