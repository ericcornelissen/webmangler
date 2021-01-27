import ManglerExpression from "../../mangler-expression.class";

const expressions: ManglerExpression[] = [
  // e.g. CSS variable declarations
  //  --(foo)(:) #000;
  //  --(foo)( :) #000;
  new ManglerExpression(
    "--(%s)(\\s*:)",
    ManglerExpression.matchParserForIndex(1),
    ManglerExpression.matchReplacerBy("--%s$2"),
  ),

  // e.g. CSS variable usage
  //  color: var\((--)(foo)()\)
  //  color: var\(( --)(foo)()\)
  //  color: var\((--)(foo)( )\)
  //  color: var\(( --)(foo)( )\)
  new ManglerExpression(
    "var\\((\\s*--)(%s)(\\s*)\\)",
    ManglerExpression.matchParserForIndex(2),
    ManglerExpression.matchReplacerBy("var($1%s$3)"),
  ),
];

export default expressions;
