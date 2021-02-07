import ManglerExpression from "../utils/mangler-expression.class";

const expressions: ManglerExpression[] = [
  // CSS variable declarations, e.g.:
  //  `--(foo): 'bar';`
  //  `--(foo) : 'bar;`
  new ManglerExpression(
    "--(%s)(?=\\s*:)",
    ManglerExpression.matchParserForIndex(1),
    ManglerExpression.matchReplacerBy("--%s"),
  ),

  // CSS variable usage, e.g.:
  //  `var(--foo);`
  //  `var(--foo, 'bar');`
  //  `var ( --foo );`
  new ManglerExpression(
    "(?<=var\\s*\\(\\s*)--(%s)(?=\\s*(,|\\)))",
    ManglerExpression.matchParserForIndex(1),
    ManglerExpression.matchReplacerBy("--%s"),
  ),
];

export default expressions;
