import ManglerExpression from "../../mangler-expression.class";

const expressions: ManglerExpression[] = [
  /* Single quotes */

  // e.g.
  //  <div style=('--)(foo)(:) #000;'>
  //  <div style=('color: #000; --)(foo)(:) #000;'>
  //  <div style=('--)(foo)(:) #000; font: serif;'>
  //  <div style=('color: #000; --)(foo)(:) #000; font: serif;'>
  new ManglerExpression(
    "style(\\s*=\\s*)('[^']*--)(%s)(\\s*:)",
    ManglerExpression.matchParserForIndex(3),
    ManglerExpression.matchReplacerBy("style$1$2%s$4"),
  ),

  /* Double quotes */

  // e.g.
  //  <div style=("--)(foo)(:) #000;">
  //  <div style=("color: #000; --)(foo)(:) #000;">
  //  <div style=("--)(foo)(:) #000; font: serif;">
  //  <div style=("color: #000; --)(foo)(:) #000; font: serif;">
  new ManglerExpression(
    "style(\\s*=\\s*)(\"[^\"]*--)(%s)(\\s*:)",
    ManglerExpression.matchParserForIndex(3),
    ManglerExpression.matchReplacerBy("style$1$2%s$4"),
  ),
];

export default expressions;
