import type { JsFunctionValues, JsStatementValues } from "./types";

const DEFAULT_FUNCTION_NAME = "fn";
const DEFAULT_LEFT_HAND = "var x";

/**
 * Build a syntactically valid JavaScript function call.
 *
 * If no `name` is provided the function name will be "fn". For all other values
 * the default is an empty string.
 *
 * @param functionValues The values to build a function call from.
 * @returns A string of a function call.
 */
export function buildJsFunctionCall(functionValues: JsFunctionValues): string {
  const {
    beforeName = "",
    name = DEFAULT_FUNCTION_NAME,
    afterName = "",
    beforeArgs = "",
    args = "",
    afterArgs = "",
    afterFunction = "",
  } = functionValues;

  return beforeName +
    name +
    afterName +
    "(" +
    beforeArgs +
    args +
    afterArgs +
    ")" +
    afterFunction;
}

/**
 * Build a JavaScript inline comment from a string.
 *
 * @example
 * const comment = buildJsLineComment("foobar");
 * console.log(comment);  // "\/\* foobar \*\/";
 * @param commentText The comment text.
 * @returns The text as a JavaScript inline comment.
 */
export function buildJsInlineComment(commentText: string): string {
  return `/*${commentText}*/`;
}

/**
 * Build a JavaScript line comment from a string.
 *
 * @example
 * const comment = buildJsLineComment("foobar");
 * console.log(comment);  // "// foobar";
 * @param commentText The comment text.
 * @returns The text as a JavaScript line comment.
 */
export function buildJsLineComment(commentText: string): string {
  return `//${commentText}`;
}

/**
 * Build a syntactically valid JavaScript statement.
 *
 * If no `leftHand` is provided the left-hand will be "var x". If no `rightHand`
 * is provided the right-hand side of the statement will be omitted (and the
 * `beforeRightHand` and `afterRightHand` values ignored). For all other values
 * the default is an empty string.
 *
 * @param statementValues The values to build a statement from.
 * @returns A string of a function call.
 */
export function buildJsStatement(
  statementValues: JsStatementValues,
): string {
  const {
    beforeLeftHand = "",
    leftHand = DEFAULT_LEFT_HAND,
    afterLeftHand = "",
    beforeRightHand = "",
    rightHand,
    afterRightHand = "",
    afterStatement = "",
  } = statementValues;

  if (rightHand === undefined) {
    return beforeLeftHand +
      leftHand +
      afterLeftHand +
      ";" +
      afterStatement;
  } else {
    return beforeLeftHand +
      leftHand +
      afterLeftHand +
      "=" +
      beforeRightHand +
      rightHand +
      afterRightHand +
      ";" +
      afterStatement;
  }
}

/**
 * Build syntactically valid JavaScript statements from a list of collections of
 * values. One JavaScript statement is created for each collection of values.
 *
 * @param statementsValues Zero or more {@link HtmlElementValues}.
 * @returns A string of HTML elements.
 */
export function buildJsStatements(
  statementsValues: Iterable<JsStatementValues>,
): string {
  let script = "";
  for (const values of statementsValues) {
    script += buildJsStatement(values);
  }

  return script;
}

/**
 * Build JavaScript strings from a given text. Quotes in the text are
 * automatically escaped.
 *
 * @param stringText The string text.
 * @returns A list of strings of `stringText` as a JavaScript string.
 */
export function buildJsStrings(stringText: string): string[] {
  return [
    `"${stringText.replace(/"/g, "\\\"")}"`,
    `'${stringText.replace(/'/g, "\\'")}'`,
    `\`${stringText.replace(/`/g, "\\`")}\``,
  ];
}
