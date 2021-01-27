import ManglerExpression from "../../mangler-expression.class";

const expressions: ManglerExpression[] = [
  /* Single quotes */

  // e.g.
  //  ('[)(foo)(])'
  //  ('[)(foo)(=)bar]'
  //  ('[)(foo)(~)=bar]'
  //  ('[)(foo)(|)=bar]'
  //  ('[)(foo)(^)=bar]'
  //  ('[)(foo)($)=bar]'
  //  ('[)(foo)(*)=bar]'
  //  ('.bar[)(foo)(])'
  //  ('#bar[)(foo)(])'
  new ManglerExpression(
    "('[^']*\\[)(%s)([\\]=\\~\\|\\^\\$\\*])",
    ManglerExpression.matchParserForIndex(2),
    ManglerExpression.matchReplacerBy("$1%s$3"),
  ),

  // e.g. $el.getAttribute('foo')
  new ManglerExpression(
    "('\\s*)(%s)(\\s*')",
    ManglerExpression.matchParserForIndex(2),
    ManglerExpression.matchReplacerBy("$1%s$3"),
  ),

  /* Double quotes */

  // e.g.
  //  ("[)(foo)(])"
  //  ("[)(foo)(=)bar]"
  //  ("[)(foo)(~)=bar]"
  //  ("[)(foo)(|)=bar]"
  //  ("[)(foo)(^)=bar]"
  //  ("[)(foo)($)=bar]"
  //  ("[)(foo)(*)=bar]"
  //  (".bar[)(foo)(])"
  //  ("#bar[)(foo)(])"
  new ManglerExpression(
    "(\"[^\"]*\\[)(%s)([\\]=\\~\\|\\^\\$\\*])",
    ManglerExpression.matchParserForIndex(2),
    ManglerExpression.matchReplacerBy("$1%s$3"),
  ),

  // e.g. $el.getAttribute("foo")
  new ManglerExpression(
    "(\"\\s*)(%s)(\\s*\")",
    ManglerExpression.matchParserForIndex(2),
    ManglerExpression.matchReplacerBy("$1%s$3"),
  ),

  /* Backticks */

  // e.g.
  //  (`[)(foo)(])`
  //  (`[)(foo)(=)bar]`
  //  (`[)(foo)(~)=bar]`
  //  (`[)(foo)(|)=bar]`
  //  (`[)(foo)(^)=bar]`
  //  (`[)(foo)($)=bar]`
  //  (`[)(foo)(*)=bar]`
  //  (`.bar[)(foo)(])`
  //  (`#bar[)(foo)(])`
  new ManglerExpression(
    "(`[^`]*\\[)(%s)([\\]=\\~\\|\\^\\$\\*])",
    ManglerExpression.matchParserForIndex(2),
    ManglerExpression.matchReplacerBy("$1%s$3"),
  ),

  // e.g. $el.getAttribute(`foo`)
  new ManglerExpression(
    "(`\\s*)(%s)(\\s*`)",
    ManglerExpression.matchParserForIndex(2),
    ManglerExpression.matchReplacerBy("$1%s$3"),
  ),
];

export default expressions;
