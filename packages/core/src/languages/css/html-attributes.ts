import ManglerExpression from "../../mangler-expression.class";

const expressions: ManglerExpression[] = [
  // e.g.
  //  ([)(foo)(])
  //  ([)(foo)(=)bar]
  //  ([)(foo)(~)=bar]
  //  ([)(foo)(|)=bar]
  //  ([)(foo)(^)=bar]
  //  ([)(foo)($)=bar]
  //  ([)(foo)(*)=bar]
  new ManglerExpression(
    "\\[(%s)([\\]\\=\\~\\|\\^\\$\\*])",
    ManglerExpression.matchParserForIndex(1),
    ManglerExpression.matchReplacerBy("[%s$2"),
  ),
];

export default expressions;
