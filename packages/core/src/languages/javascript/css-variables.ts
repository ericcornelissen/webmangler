import ManglerExpression from "../utils/mangler-expression.class";

const expressions: ManglerExpression[] = [
  /* Single quotes */

  // e.g.
  //  ('--)(foo)(')
  //  ('--)(foo)( )'
  new ManglerExpression(
    "'--(%s)([\\s'])",
    ManglerExpression.matchParserForIndex(1),
    ManglerExpression.matchReplacerBy("'--%s$2"),
  ),

  // e.g.
  //  (' --)(foo)(')
  //  (' --)(foo)( )'
  //  ('bar --)(foo)(')
  //  ('bar --)(foo)( )'
  new ManglerExpression(
    "('[^']*\\s--)(%s)([\\s'])",
    ManglerExpression.matchParserForIndex(2),
    ManglerExpression.matchReplacerBy("$1%s$3"),
  ),

  /* Double quotes */

  // e.g.
  //  ("--)(foo)(")
  //  ("--)(foo)( )"
  new ManglerExpression(
    "\"--(%s)([\\s\"])",
    ManglerExpression.matchParserForIndex(1),
    ManglerExpression.matchReplacerBy("\"--%s$2"),
  ),

  // e.g.
  //  (" --)(foo)(")
  //  (" --)(foo)( )"
  //  ("bar --)(foo)(")
  //  ("bar --)(foo)( )"
  new ManglerExpression(
    "(\"[^\"]*\\s--)(%s)([\\s\"])",
    ManglerExpression.matchParserForIndex(2),
    ManglerExpression.matchReplacerBy("$1%s$3"),
  ),

  /* Backticks */

  // e.g.
  //  (`--)(foo)(`)
  //  (`--)(foo)( )`
  new ManglerExpression(
    "`--(%s)([\\s`])",
    ManglerExpression.matchParserForIndex(1),
    ManglerExpression.matchReplacerBy("`--%s$2"),
  ),

  // e.g.
  //  (` --)(foo)(`)
  //  (` --)(foo)()`
  //  (`bar --)(foo)(`)
  //  (`bar --)(foo)( )`
  new ManglerExpression(
    "(`[^`]*\\s--)(%s)([\\s`])",
    ManglerExpression.matchParserForIndex(2),
    ManglerExpression.matchReplacerBy("$1%s$3"),
  ),
];

export default expressions;
