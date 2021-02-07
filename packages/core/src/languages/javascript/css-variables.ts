import ManglerExpression from "../utils/mangler-expression.class";

const GROUP_QUOTE = "quote";

const expressions: ManglerExpression[] = [
  new ManglerExpression(
    `(?<=(?<${GROUP_QUOTE}>"|'|\`)\\s*)--(%s)(?=\\s*\\k<${GROUP_QUOTE}>)`,
    ManglerExpression.matchParserForIndex(2),
    ManglerExpression.matchReplacerBy("--%s"),
  ),
];

export default expressions;
