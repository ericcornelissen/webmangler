import type { JsStatementValuesPresets } from "./types";

/**
 * A list of valid function call.
 */
const functionCalls: string[] = [
  "callback()",
  "foo(bar)",
];

/**
 * A list of valid inline comments.
 *
 * @example "\/\* foobar \*\/"
 */
const inlineComments: string[] = [
  "/**/",
  "/* */",
  "/*foobar*/",
  "/* Hello world! */",
];

/**
 * A list of valid line comments.
 *
 * @example "// foobar"
 */
const lineComments: string[] = [
  "//\n",
  "//foobar\n",
  "// Hello world!\n",
];

/**
 * A list of valid JavaScript literals.
 */
const literals: string[] = [
  "42",
  "3.14",
  "'Hello world!'",
  "\"Praise the sun\"",
];

/**
 * A list of valid variable declarations.
 */
const variableDeclarations: string[] = [
  "var x",
  "let y",
  "const z",
];

/**
 * A list of valid whitespace.
 */
const whitespace: string[] = [
  "",
  " ",
  "\t",
];

/**
 * A collection of sample values for testing the JavaScript language plugin.
 */
export const sampleValues = {
  inlineComments,
  lineComments,
  whitespace,
};

/**
 * A collection of preset values for testing the JavaScript language plugin.
 */
export const valuePresets: JsStatementValuesPresets = {
  beforeLeftHand: new Set([
    ...inlineComments,
    ...whitespace,
  ]),
  leftHand: new Set([
    ...variableDeclarations,
  ]),
  afterLeftHand: new Set([
    ...inlineComments,
    ...whitespace,
  ]),
  beforeRightHand: new Set([
    ...inlineComments,
    ...whitespace,
  ]),
  rightHand: new Set([
    ...literals,
    ...functionCalls,
  ]),
  afterRightHand: new Set([
    ...inlineComments,
    ...whitespace,
  ]),
  afterStatement: new Set([
    ...inlineComments,
    ...lineComments,
    ...whitespace,
  ]),
};
