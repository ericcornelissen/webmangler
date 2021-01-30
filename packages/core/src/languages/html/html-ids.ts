import ManglerExpression from "../utils/mangler-expression.class";

const expressions: ManglerExpression[] = [
  /* Single quotes */

  // e.g.
  //  id=(')(foo)(')
  //  id= (' )(foo)(')
  //  id =(')(foo)( ')
  //  id = (')(foo)( ')
  new ManglerExpression(
    "id(\\s*=\\s*)('\\s*)(%s)(\\s*')",
    ManglerExpression.matchParserForIndex(3),
    ManglerExpression.matchReplacerBy("id$1$2%s$4"),
  ),

  // e.g.
  //  href=('#)(foo)(')
  //  href= (' #)(foo)( ')
  //  href =('/path/to/page#)(foo)(')
  //  href = ('https://example.com/#)(foo)(')
  new ManglerExpression(
    "href(\\s*=\\s*)('[^']*#)(%s)(\\s*')",
    ManglerExpression.matchParserForIndex(3),
    ManglerExpression.matchReplacerBy("href$1$2%s$4"),
  ),

  /* Double quotes */

  // e.g.
  //  id=(")(foo)(")
  //  id= (" )(foo)(")
  //  id =(")(foo)( ")
  //  id = (" )(foo)( ")
  new ManglerExpression(
    "id(\\s*=\\s*)(\"\\s*)(%s)(\\s*\")",
    ManglerExpression.matchParserForIndex(3),
    ManglerExpression.matchReplacerBy("id$1$2%s$4"),
  ),

  // e.g.
  //  href=("#)(foo)(")
  //  href= (" #)(foo)( ")
  //  href =("/path/to/page#)(foo)(")
  //  href = ("https://example.com/#)(foo)(")
  new ManglerExpression(
    "href(\\s*=\\s*)(\"[^\"]*\\#)(%s)(\\s*\")",
    ManglerExpression.matchParserForIndex(3),
    ManglerExpression.matchReplacerBy("href$1$2%s$4"),
  ),
];

export default expressions;
