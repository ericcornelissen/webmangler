import ManglerExpression from "../../mangler-expression.class";

const expressions: ManglerExpression[] = [
  /* Single quotes */

  // e.g. in `document.getElementById()`
  //  (')(foo)(')
  //  (' )(foo)(')
  //  (')(foo)( ')
  //  (' )(foo)( ')
  new ManglerExpression(
    "('\\s*)(%s)(\\s*')",
    ManglerExpression.matchParserForIndex(2),
    ManglerExpression.matchReplacerBy("$1%s$3"),
  ),

  // e.g. in `document.querySelectorAll()`
  //  ('#)(foo)(')
  //  ('#)(foo)( )'
  //  ('#)(foo)(.)bar'
  //  ('#)(foo)([)data-value]'
  //  (' #)(foo)(')
  //  ('div#)(foo)( )'
  //  ('div #)(foo)(.)bar'
  //  ('.bar#)(foo)([)data-value]'
  new ManglerExpression(
    "('[^']*\\#)(%s)(['\\s\\.\\[])",
    ManglerExpression.matchParserForIndex(2),
    ManglerExpression.matchReplacerBy("$1%s$3"),
  ),

  /* Double quotes */

  // e.g. in `document.getElementById()`
  //  (")(foo)(")
  //  (" )(foo)(")
  //  (")(foo)( ")
  //  (" )(foo)( ")
  new ManglerExpression(
    "(\"\\s*)(%s)(\\s*\")",
    ManglerExpression.matchParserForIndex(2),
    ManglerExpression.matchReplacerBy("$1%s$3"),
  ),

  // e.g. in `document.querySelectorAll()`
  //  ("#)(foo)(")
  //  ("#)(foo)( )"
  //  ("#)(foo)(.)bar"
  //  ("#)(foo)([)data-value]"
  //  (" #)(foo)(")
  //  ("div#)(foo)( )"
  //  ("div #)(foo)(.)bar"
  //  (".bar#)(foo)([)data-value]"
  new ManglerExpression(
    "(\"[^\"]*\\#)(%s)([\"\\s\\.\\[])",
    ManglerExpression.matchParserForIndex(2),
    ManglerExpression.matchReplacerBy("$1%s$3"),
  ),

  /* Backticks */

  // e.g. in `document.getElementById()`
  //  (")(foo)(")
  //  (" )(foo)(")
  //  (")(foo)( ")
  //  (" )(foo)( ")
  new ManglerExpression(
    "(`\\s*)(%s)(\\s*`)",
    ManglerExpression.matchParserForIndex(2),
    ManglerExpression.matchReplacerBy("$1%s$3"),
  ),

  // e.g. in `document.querySelectorAll()`
  //  (`#)(foo)(`)
  //  (`#)(foo)( )`
  //  (`#)(foo)(.)bar`
  //  (`#)(foo)([)data-value]`
  //  (` #)(foo)(`)
  //  (`div#)(foo)( )`
  //  (`div #)(foo)(.)bar`
  //  (`.bar#)(foo)([)data-value]`
  new ManglerExpression(
    "(`[^`]*\\#)(%s)([`\\s\\.\\[])",
    ManglerExpression.matchParserForIndex(2),
    ManglerExpression.matchReplacerBy("$1%s$3"),
  ),
];

export default expressions;
