import type { TestScenario } from "@webmangler/testing";
import type { TestCase } from "./types";

import { expect, use as chaiUse } from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";
import { format as printf } from "util";

import {
  ATTRIBUTE_SELECTOR_OPERATORS,
  ATTRIBUTE_SELECTORS,
  PSEUDO_ELEMENT_SELECTORS,
  PSEUDO_SELECTORS,
  SELECTOR_COMBINATORS,
} from "./css-constants";
import { SELF_CLOSING_TAGS, STANDARD_TAGS } from "./html-constants";
import { isValidIdName, varyQuotes, varySpacing } from "./test-helpers";

import EngineMock from "../../__mocks__/engine.mock";
import WebManglerFileMock from "../../__mocks__/mangler-file.mock";

import mangleEngine from "../../engine";
import BuiltInLanguageSupport from "../../languages/builtin";
import HtmlIdMangler from "../html-ids";

const builtInLanguageSupport = new BuiltInLanguageSupport();

const DEFAULT_PATTERN = "id[-_][a-zA-Z-_]+";
const SELECTORS: [string, string][] = [
  ["div", "div"],
  ["#foobar", "#foobar"],
  [".foobar", ".foobar"],
  ["[data-foo]", "[data-foo]"],
  ["#id-foobar", "#a"],
];
const SELECTOR_PAIRS: [string, string, string, string][] = [
  ["div", "span", "div", "span"],
  ["#foo", "#bar", "#foo", "#bar"],
  [".foo", ".bar", ".foo", ".bar"],
  ["div", "#foobar", "div", "#foobar"],
  ["div", ".foobar", "div", ".foobar"],
  ["#foobar", "div", "#foobar", "div"],
  ["#foo", ".bar", "#foo", ".bar"],
  [".foobar", "div", ".foobar", "div"],
  [".foo", "#bar", ".foo", "#bar"],
  ["div", "#id-foo", "div", "#a"],
  ["#id-foo", "div", "#a", "div"],
  [".foo", "#id-bar", ".foo", "#a"],
  ["#id-foo", ".bar", "#a", ".bar"],
  ["#foo", "#id-bar", "#foo", "#a"],
  ["#id-foo", "#bar", "#a", "#bar"],
  ["#id-foo", "#id-bar", "#a", "#b"],
  ["#id-foo", "#id-foo", "#a", "#a"],
];

chaiUse(sinonChai);

suite("HTML ID Mangler", function() {
  suite("CSS", function() {
    const scenarios: TestScenario<TestCase>[] = [
      {
        name: "individual selectors",
        cases: [
          ...SELECTORS
            .map(([before, after]) => ({
              input: `${before}{}`,
              expected: `${after}{}`,
            }))
            .map((testCase) => varySpacing(["{", "}"], testCase))
            .flat(),
          ...SELECTOR_PAIRS
            .map(([beforeA, beforeB, afterA, afterB]) => ({
              input: `${beforeA} { } ${beforeB} { }`,
              expected: `${afterA} { } ${afterB} { }`,
            })),
          {
            input: "#id-foo { color: red; }",
            expected: "#a { color: red; }",
          },
          {
            input: "#id-foo { font-size: 12px; } #id-bar { font-weight: bold; }",
            expected: "#a { font-size: 12px; } #b { font-weight: bold; }",
          },
          {
            input: ":root { } #id-foo { } #id-bar { }",
            expected: ":root { } #a { } #b { }",
          },
          {
            input: "#id-foo { } div { } #id-bar { }",
            expected: "#a { } div { } #b { }",
          },
          {
            input: "#id-foo { } #id-bar { } span { }",
            expected: "#a { } #b { } span { }",
          },
          {
            input: ":root { } #id-foo { } div { } #id-bar { }",
            expected: ":root { } #a { } div { } #b { }",
          },
          {
            input: ":root { } #id-foo { } #id-bar { } span { }",
            expected: ":root { } #a { } #b { } span { }",
          },
          {
            input: "#id-foo { } div { } #id-bar { } span { }",
            expected: "#a { } div { } #b { } span { }",
          },
          {
            input: ":root { } #id-foo { } div { } #id-bar { } span { }",
            expected: ":root { } #a { } div { } #b { } span { }",
          },
          {
            input: "#id-praise { } #id-the { } #id-sun { }",
            expected: "#a { } #b { } #c { }",
          },
        ],
      },
      {
        name: "pseudo selectors",
        cases: [
          ...SELECTORS
            .map(([selectorBefore, selectorAfter]): TestCase[] => [
              ...PSEUDO_SELECTORS.map((pseudoSelector: string): TestCase => ({
                input: `${selectorBefore}:${pseudoSelector} { }`,
                expected: `${selectorAfter}:${pseudoSelector} { }`,
              })),
              ...PSEUDO_ELEMENT_SELECTORS.map((pseudoElementSelector: string): TestCase => ({
                input: `${selectorBefore}:${pseudoElementSelector} { }`,
                expected: `${selectorAfter}:${pseudoElementSelector} { }`,
              })),
            ])
            .flat(),
        ],
      },
      {
        name: "attribute selectors",
        cases: [
          ...SELECTORS
            .map(([selectorBefore, selectorAfter]): TestCase[] => [
              ...ATTRIBUTE_SELECTORS.map((attributeSelector: string): TestCase => ({
                input: `${selectorBefore}[${attributeSelector}] { }`,
                expected: `${selectorAfter}[${attributeSelector}] { }`,
              })),
            ])
            .flat(),
        ],
      },
      {
        name: "combinators",
        cases: [
          ...SELECTOR_PAIRS
            .map(([beforeA, beforeB, afterA, afterB]): TestCase[] => [
              ...SELECTOR_COMBINATORS
                .map((combinator): TestCase[] => {
                  if (combinator === "" && beforeB.match(/^[a-z]/)) {
                    return [];
                  }

                  return varySpacing(combinator, {
                    input: `${beforeA}${combinator}${beforeB} { }`,
                    expected: `${afterA}${combinator}${afterB} { }`,
                  });
                })
                .flat(),
            ])
            .flat(),
        ],
      },
      {
        name: "in href attribute selector",
        cases: [
          ...ATTRIBUTE_SELECTOR_OPERATORS
            .map((x): TestCase => ({
              input: `[href${x}"#id-foo"]`,
              expected: `[href${x}"#a"]`,
            }))
            .map((testCase) => varySpacing("\"", testCase))
            .flat()
            .map((testCase) => varyQuotes("css", testCase))
            .flat(),
        ],
      },
      {
        name: "non-id selectors that match the pattern(s)",
        cases: [
          {
            input: "div { } #div { }",
            expected: "div { } #a { }",
            pattern: "[a-zA-Z-]+",
          },
          {
            input: ".foo { } #foo { }",
            expected: ".foo { } #a { }",
            pattern: "[a-zA-Z-]+",
          },
          ...ATTRIBUTE_SELECTORS
            .filter(isValidIdName)
            .map((s: string): TestCase => {
              return {
                input: `div[${s}] { } #${s} { }`,
                expected: `div[${s}] { } #a { }`,
                pattern: "[a-zA-Z-]+",
              };
            }),
          ...PSEUDO_SELECTORS
            .filter(isValidIdName)
            .map((s: string): TestCase => {
              return {
                input: `input:${s} { } #${s} { }`,
                expected: `input:${s} { } #a { }`,
                pattern: "[a-zA-Z-]+",
              };
            }),
          ...PSEUDO_ELEMENT_SELECTORS
            .filter(isValidIdName)
            .map((s: string): TestCase => {
              return {
                input: `div::${s} { } #${s} { }`,
                expected: `div::${s} { } #a { }`,
                pattern: "[a-zA-Z-]+",
              };
            }),
        ],
      },
      {
        name: "corner cases",
        cases: [
          {
            input: "#id-foo",
            expected: "#a",
            description: "mangle dangling ids",
          },
          {
            input: "div{}#id-foo{}",
            expected: "div{}#a{}",
            description: "no space between closing `}` and id `#` should not matter",
          },
          {
            input: "div { content: \"id-foo\" } #id-foo { }",
            expected: "div { content: \"id-foo\" } #a { }",
          },
          ...["div { content: \"#id-foo\" }", "div[data-foo=\"#id-bar\"] { }"]
            .map((testCase): TestCase => ({
              input: testCase,
              expected: testCase,
            }))
            .map((testCase) => varySpacing("\"", testCase))
            .flat()
            .map((testCase) => varyQuotes("css", testCase))
            .flat(),
        ],
      },
    ];

    for (const { name, cases } of scenarios) {
      test(name, function() {
        for (const testCase of cases) {
          const {
            input,
            expected,
            pattern: idNamePattern,
            reserved: reservedIds,
            prefix: keepIdPrefix,
            description: failureMessage,
          } = testCase;

          const htmlIdMangler = new HtmlIdMangler({
            idNamePattern: idNamePattern || DEFAULT_PATTERN,
            reservedIds: reservedIds,
            keepIdPrefix: keepIdPrefix,
          });
          htmlIdMangler.use(builtInLanguageSupport);

          const files = [new WebManglerFileMock("css", input)];
          const options = htmlIdMangler.config();
          const result = mangleEngine(files, options);
          expect(result).to.have.length(1);

          const out = result[0];
          expect(out.content).to.equal(expected, failureMessage);
        }
      });
    }
  });

  suite("HTML", function() {
    const ATTR_SAMPLE: string[] = ["id=\"", "href=\"#", "href=\"/foo/bar#"];

    const scenarios: TestScenario<TestCase>[] = [
      {
        name: "non-id attributes",
        cases: [
          {
            input: "<div></div>",
            expected: "<div></div>",
          },
          {
            input: "<p>foobar</p>",
            expected: "<p>foobar</p>",
          },
          ...varyQuotes("html", {
            input: "<div class=\"foo bar\"></div>",
            expected: "<div class=\"foo bar\"></div>",
          }),
          ...varyQuotes("html", {
            input: "<div data-foo=\"bar\"></div>",
            expected: "<div data-foo=\"bar\"></div>",
          }),
        ],
      },
      ...ATTR_SAMPLE
        .map((attr): TestScenario<TestCase> => ({
          name: `\`${attr}id-xxx"\` on one element`,
          cases: [
            ...varySpacing("=", {
              input: `<div ${attr}id-foo"></div>`,
              expected: `<div ${attr}a"></div>`,
            }),
            ...varySpacing("\"", {
              input: `<div ${attr}id-foo"></div>`,
              expected: `<div ${attr}a"></div>`,
            }),
            ...varyQuotes("html", {
              input: `<div ${attr}id-foo"></div>`,
              expected: `<div ${attr}a"></div>`,
            }),
            ...STANDARD_TAGS
              .map((tag) => ({
                input: `<${tag} ${attr}id-foo"></${tag}>`,
                expected: `<${tag} ${attr}a"></${tag}>`,
              })),
            ...SELF_CLOSING_TAGS
              .map((tag) => ({
                input: `<${tag} ${attr}id-foo"/>`,
                expected: `<${tag} ${attr}a"/>`,
              })),
            {
              input: `<p ${attr}id-foo">Hello world!</p>`,
              expected: `<p ${attr}a">Hello world!</p>`,
            },
            {
              input: `<div class="foo" ${attr}id-bar"></div>`,
              expected: `<div class="foo" ${attr}a"></div>`,
            },
            {
              input: `<div ${attr}id-foo" data-foo="bar"></div>`,
              expected: `<div ${attr}a" data-foo="bar"></div>`,
            },
            {
              input: `<div class="foo" ${attr}id-bar" data-foo="bar"></div>`,
              expected: `<div class="foo" ${attr}a" data-foo="bar"></div>`,
            },
            {
              input: `<div disabled ${attr}id-foo"></div>`,
              expected: `<div disabled ${attr}a"></div>`,
            },
            {
              input: `<div ${attr}id-foo" aria-hidden></div>`,
              expected: `<div ${attr}a" aria-hidden></div>`,
            },
            {
              input: `<div disabled ${attr}id-foo" aria-hidden></div>`,
              expected: `<div disabled ${attr}a" aria-hidden></div>`,
            },
            {
              input: `<div class="foo" ${attr}id-bar" aria-hidden></div>`,
              expected: `<div class="foo" ${attr}a" aria-hidden></div>`,
            },
            {
              input: `<div disabled ${attr}id-foo" data-foo="bar"></div>`,
              expected: `<div disabled ${attr}a" data-foo="bar"></div>`,
            },
          ],
        })),
      ...ATTR_SAMPLE
        .map((attr): TestScenario<TestCase> => ({
          name: `adjacent elements with \`${attr}id-xxx"\``,
          cases: [
            {
              input: `
                <div ${attr}id-foo"></div>
                <div ${attr}id-bar"></div>
              `,
              expected: `
                <div ${attr}a"></div>
                <div ${attr}b"></div>
              `,
            },
            {
              input: `
                <div></div>
                <div ${attr}id-foo"></div>
                <div ${attr}id-bar"></div>
              `,
              expected: `
                <div></div>
                <div ${attr}a"></div>
                <div ${attr}b"></div>
              `,
            },
            {
              input: `
                <div ${attr}id-foo"></div>
                <div></div>
                <div ${attr}id-bar"></div>
              `,
              expected: `
                <div ${attr}a"></div>
                <div></div>
                <div ${attr}b"></div>
              `,
            },
            {
              input: `
                <div ${attr}id-foo"></div>
                <div ${attr}id-bar"></div>
                <div></div>
              `,
              expected: `
                <div ${attr}a"></div>
                <div ${attr}b"></div>
                <div></div>
              `,
            },
            {
              input: `
                <div></div>
                <div ${attr}id-foo"></div>
                <div></div>
                <div ${attr}id-bar"></div>
              `,
              expected: `
                <div></div>
                <div ${attr}a"></div>
                <div></div>
                <div ${attr}b"></div>
              `,
            },
            {
              input: `
                <div></div>
                <div ${attr}id-foo"></div>
                <div ${attr}id-bar"></div>
                <div></div>
              `,
              expected: `
                <div></div>
                <div ${attr}a"></div>
                <div ${attr}b"></div>
                <div></div>
              `,
            },
            {
              input: `
                <div></div>
                <div ${attr}id-foo"></div>
                <div></div>
                <div ${attr}id-bar"></div>
                <div></div>
              `,
              expected: `
                <div></div>
                <div ${attr}a"></div>
                <div></div>
                <div ${attr}b"></div>
                <div></div>
              `,
            },
            {
              input: `
                <div ${attr}id-praise"></div>
                <div></div>
                <div ${attr}id-the"></div>
                <div></div>
                <div ${attr}id-sun"></div>
              `,
              expected: `
                <div ${attr}a"></div>
                <div></div>
                <div ${attr}b"></div>
                <div></div>
                <div ${attr}c"></div>
              `,
            },
          ],
        })),
      ...ATTR_SAMPLE
        .map((attr): TestScenario<TestCase> => ({
          name: `nested elements with \`${attr}id-xxx"\``,
          cases: [
            {
              input: `
                <div ${attr}id-foo">
                  <p></p>
                </div>
              `,
              expected: `
                <div ${attr}a">
                  <p></p>
                </div>
              `,
            },
            {
              input: `
                <div>
                  <p ${attr}id-bar"></p>
                </div>
              `,
              expected: `
                <div>
                  <p ${attr}a"></p>
                </div>
              `,
            },
            {
              input: `
                <div ${attr}id-foo">
                  <p ${attr}id-bar"></p>
                </div>
              `,
              expected: `
                <div ${attr}a">
                  <p ${attr}b"></p>
                </div>
              `,
            },
            {
              input: `
                <div>
                  <p>
                    <b ${attr}id-foobar"></b>
                  </p>
                </div>
              `,
              expected: `
                <div>
                  <p>
                    <b ${attr}a"></b>
                  </p>
                </div>
              `,
            },
            {
              input: `
                <div ${attr}id-foo">
                  <p ${attr}id-bar">
                    <b></b>
                  </p>
                </div>
              `,
              expected: `
                <div ${attr}a">
                  <p ${attr}b">
                    <b></b>
                  </p>
                </div>
              `,
            },
            {
              input: `
                <div ${attr}id-foo">
                  <p>
                    <b ${attr}id-bar"></b>
                  </p>
                </div>
              `,
              expected: `
                <div ${attr}a">
                  <p>
                    <b ${attr}b"></b>
                  </p>
                </div>
              `,
            },
            {
              input: `
                <div>
                  <p ${attr}id-foo">
                    <b ${attr}id-bar"></b>
                  </p>
                </div>
              `,
              expected: `
                <div>
                  <p ${attr}a">
                    <b ${attr}b"></b>
                  </p>
                </div>
              `,
            },
            {
              input: `
                <div ${attr}id-praise">
                  <p ${attr}id-the">
                    <b ${attr}id-sun"></b>
                  </p>
                </div>
              `,
              expected: `
                <div ${attr}a">
                  <p ${attr}b">
                    <b ${attr}c"></b>
                  </p>
                </div>
              `,
            },
          ],
        })),
      {
        name: "non-id attributes that match the pattern",
        cases: [
          {
            input: "<div class=\"id-foo\" id=\"id-foo\"></div>",
            expected: "<div class=\"id-foo\" id=\"a\"></div>",
          },
          {
            input: "<div class=\"id-foo\"></div><div id=\"id-foo\"></div>",
            expected: "<div class=\"id-foo\"></div><div id=\"a\"></div>",
          },
        ],
      },
      {
        name: "corner cases",
        cases: [
          {
            input: "<div id></div>",
            expected: "<div id></div>",
          },
          ...varyQuotes("html", {
            input: "<div id=\"\"></div>",
            expected: "<div id=\"\"></div>",
          }),
          {
            input: "<p>id-foo</p>",
            expected: "<p>id-foo</p>",
            description: "Anything inside tags matching the pattern should be ignored.",
          },
          {
            input: "<p>#id-foo</p>",
            expected: "<p>#id-foo</p>",
            description: "Anything inside tags matching the pattern should be ignored.",
          },
          {
            input: "<div id=\"id-foo\" id=\"id-bar\"></div>",
            expected: "<div id=\"a\" id=\"b\"></div>",
            description: "multiple class attributes on one element should all be mangled",
          },
          {
            input: "<div id=\"id-foobar\" id=\"id-foobar\"></div>",
            expected: "<div id=\"a\" id=\"a\"></div>",
            description: "multiple class attributes on one element should all be mangled",
          },
          ...ATTR_SAMPLE
            .map((attr): TestCase[] => [
              ...["data-", "x"]
                .map((prefix): TestCase => ({
                  input: `<div ${prefix}${attr}id-foo"></div>`,
                  expected: `<div ${prefix}${attr}id-foo"></div>`,
                  description: "Shouldn't mangle in attribute even if it ends in \"id\"",
                })),
            ])
            .flat(),
          {
            input: "<id class=\"foo\"></id>",
            expected: "<id class=\"foo\"></id>",
            description: "The tag \"id\" shouldn't cause problems.",
          },
        ],
      },
    ];

    for (const { name, cases } of scenarios) {
      test(name, function() {
        for (const testCase of cases) {
          const {
            input,
            expected,
            pattern: idNamePattern,
            reserved: reservedIds,
            prefix: keepIdPrefix,
            description: failureMessage,
          } = testCase;

          const htmlIdMangler = new HtmlIdMangler({
            idNamePattern: idNamePattern || DEFAULT_PATTERN,
            reservedIds: reservedIds,
            keepIdPrefix: keepIdPrefix,
          });
          htmlIdMangler.use(builtInLanguageSupport);

          const files = [new WebManglerFileMock("html", input)];
          const options = htmlIdMangler.config();
          const result = mangleEngine(files, options);
          expect(result).to.have.length(1);

          const out = result[0];
          expect(out.content).to.equal(expected, failureMessage);
        }
      });
    }
  });

  suite("JavaScript", function() {
    const scenarios: TestScenario<TestCase>[] = [
      {
        name: "id query selector",
        cases: [
          ...varyQuotes("js", {
            input: "document.querySelector(\"#id-foo\");",
            expected: "document.querySelector(\"#a\");",
          }),
          ...varySpacing(["(", "\"", ")"], {
            input: "document.querySelector(\"#id-foo\");",
            expected: "document.querySelector(\"#a\");",
          }),
          {
            input: "document.querySelector(\"div\");",
            expected: "document.querySelector(\"div\");",
          },
          {
            input: "document.querySelector(\".foo\");",
            expected: "document.querySelector(\".foo\");",
          },
          {
            input: "document.querySelector(\"[data-foo]\");",
            expected: "document.querySelector(\"[data-foo]\");",
          },
          {
            input: "document.querySelector(\":root\");",
            expected: "document.querySelector(\":root\");",
          },
        ],
      },
      {
        name: "id query selector with pseudo selectors",
        cases: [
          ...PSEUDO_SELECTORS.map((s: string): TestCase => ({
            input: `document.querySelector("#id-foo:${s}");`,
            expected: `document.querySelector("#a:${s}");`,
          })),
          ...PSEUDO_ELEMENT_SELECTORS.map((s: string): TestCase => ({
            input: `document.querySelector("#id-foo::${s}");`,
            expected: `document.querySelector("#a::${s}");`,
          })),
          ...PSEUDO_SELECTORS.map((s: string): TestCase => ({
            input: `document.querySelector("div:${s}");`,
            expected: `document.querySelector("div:${s}");`,
          })),
          ...PSEUDO_ELEMENT_SELECTORS.map((s: string): TestCase => ({
            input: `document.querySelector("div::${s}");`,
            expected: `document.querySelector("div::${s}");`,
          })),
          ...PSEUDO_SELECTORS.map((s: string): TestCase => ({
            input: `document.querySelector(".foo:${s}");`,
            expected: `document.querySelector(".foo:${s}");`,
          })),
          ...PSEUDO_ELEMENT_SELECTORS.map((s: string): TestCase => ({
            input: `document.querySelector(".foo::${s}");`,
            expected: `document.querySelector(".foo::${s}");`,
          })),
        ],
      },
      {
        name: "id query selector with attribute selectors",
        cases: [
          ...ATTRIBUTE_SELECTORS.map((s: string): TestCase => ({
            input: `document.querySelector("#id-foo[${s}]");`,
            expected: `document.querySelector("#a[${s}]");`,
          })),
        ],
      },
      {
        name: "inverted id query selector",
        cases: [
          ...varySpacing(["(", ")"], {
            input: "document.querySelector(\":not(#id-foo)\");",
            expected: "document.querySelector(\":not(#a)\");",
          }),
        ],
      },
      {
        name: "id query selector in 'or' combinator",
        cases: [
          ...varySpacing(",", {
            input: "document.querySelector(\"#id-foo,#id-bar\");",
            expected: "document.querySelector(\"#a,#b\");",
          }),
          ...varySpacing(",", {
            input: "document.querySelector(\"div,#id-foo\");",
            expected: "document.querySelector(\"div,#a\");",
          }),
          ...varySpacing(",", {
            input: "document.querySelector(\"#id-foo,span\");",
            expected: "document.querySelector(\"#a,span\");",
          }),
          ...varySpacing(",", {
            input: "document.querySelector(\".foo,#id-bar\");",
            expected: "document.querySelector(\".foo,#a\");",
          }),
          ...varySpacing(",", {
            input: "document.querySelector(\"#id-foo,.bar\");",
            expected: "document.querySelector(\"#a,.bar\");",
          }),
          ...varySpacing(",", {
            input: "document.querySelector(\"div,#id-foo,span\");",
            expected: "document.querySelector(\"div,#a,span\");",
          }),
        ],
      },
      {
        name: "id query selector in 'and' combinator",
        cases: [
          {
            input: "document.querySelector(\"#id-foo#id-bar\");",
            expected: "document.querySelector(\"#a#b\");",
          },
          {
            input: "document.querySelector(\"div#id-foo\");",
            expected: "document.querySelector(\"div#a\");",
          },
          {
            input: "document.querySelector(\".foo#id-foo\");",
            expected: "document.querySelector(\".foo#a\");",
          },
          {
            input: "document.querySelector(\"#id-foo.bar\");",
            expected: "document.querySelector(\"#a.bar\");",
          },
          {
            input: "document.querySelector(\"div#id-foo.bar\");",
            expected: "document.querySelector(\"div#a.bar\");",
          },
        ],
      },
      {
        name: "id query selector in 'descendant' combinator",
        cases: [
          {
            input: "document.querySelector(\"#id-foo #id-bar\");",
            expected: "document.querySelector(\"#a #b\");",
          },
          {
            input: "document.querySelector(\"div #id-foo\");",
            expected: "document.querySelector(\"div #a\");",
          },
          {
            input: "document.querySelector(\"#id-foo div\");",
            expected: "document.querySelector(\"#a div\");",
          },
          {
            input: "document.querySelector(\".foo #id-bar\");",
            expected: "document.querySelector(\".foo #a\");",
          },
          {
            input: "document.querySelector(\"#id-foo .bar\");",
            expected: "document.querySelector(\"#a .bar\");",
          },
          {
            input: "document.querySelector(\".foo #id-bar div\");",
            expected: "document.querySelector(\".foo #a div\");",
          },
        ],
      },
      {
        name: "id query selector in 'child' combinator",
        cases: [
          ...varySpacing(">", {
            input: "document.querySelector(\"#id-foo>#id-bar\");",
            expected: "document.querySelector(\"#a>#b\");",
          }),
          ...varySpacing(">", {
            input: "document.querySelector(\"div>#id-foo\");",
            expected: "document.querySelector(\"div>#a\");",
          }),
          ...varySpacing(">", {
            input: "document.querySelector(\"#id-foo>div\");",
            expected: "document.querySelector(\"#a>div\");",
          }),
          ...varySpacing(">", {
            input: "document.querySelector(\".foo>#id-bar\");",
            expected: "document.querySelector(\".foo>#a\");",
          }),
          ...varySpacing(">", {
            input: "document.querySelector(\"#id-foo>.bar\");",
            expected: "document.querySelector(\"#a>.bar\");",
          }),
          ...varySpacing(">", {
            input: "document.querySelector(\"div>#id-foo>.bar\");",
            expected: "document.querySelector(\"div>#a>.bar\");",
          }),
        ],
      },
      {
        name: "id query selector in 'adjacent sibling' combinator",
        cases: [
          ...varySpacing("+", {
            input: "document.querySelector(\"#id-foo+#id-bar\");",
            expected: "document.querySelector(\"#a+#b\");",
          }),
          ...varySpacing("+", {
            input: "document.querySelector(\"div+#id-foo\");",
            expected: "document.querySelector(\"div+#a\");",
          }),
          ...varySpacing("+", {
            input: "document.querySelector(\"#id-foo+div\");",
            expected: "document.querySelector(\"#a+div\");",
          }),
          ...varySpacing("+", {
            input: "document.querySelector(\".foo+#id-bar\");",
            expected: "document.querySelector(\".foo+#a\");",
          }),
          ...varySpacing("+", {
            input: "document.querySelector(\"#id-foo+.bar\");",
            expected: "document.querySelector(\"#a+.bar\");",
          }),
          ...varySpacing("+", {
            input: "document.querySelector(\"div+#id-foo+.bar\");",
            expected: "document.querySelector(\"div+#a+.bar\");",
          }),
        ],
      },
      {
        name: "id query selector in 'general sibling' combinator",
        cases: [
          ...varySpacing("~", {
            input: "document.querySelector(\"#id-foo~#id-bar\");",
            expected: "document.querySelector(\"#a~#b\");",
          }),
          ...varySpacing("~", {
            input: "document.querySelector(\"div~#id-foo\");",
            expected: "document.querySelector(\"div~#a\");",
          }),
          ...varySpacing("~", {
            input: "document.querySelector(\"#id-foo~div\");",
            expected: "document.querySelector(\"#a~div\");",
          }),
          ...varySpacing("~", {
            input: "document.querySelector(\".foo~#id-bar\");",
            expected: "document.querySelector(\".foo~#a\");",
          }),
          ...varySpacing("~", {
            input: "document.querySelector(\"#id-foo~.bar\");",
            expected: "document.querySelector(\"#a~.bar\");",
          }),
          ...varySpacing("~", {
            input: "document.querySelector(\"div~#id-foo~.bar\");",
            expected: "document.querySelector(\"div~#a~.bar\");",
          }),
        ],
      },
      {
        name: "getElementById",
        cases: [
          ...varyQuotes("js", {
            input: "document.getElementById(\"id-foo\");",
            expected: "document.getElementById(\"a\");",
          }),
          ...varySpacing(["(", ")"], {
            input: "document.getElementById(\"id-foo\");",
            expected: "document.getElementById(\"a\");",
          }),
          {
            input: "var id = \"id-foo\"; document.getElementById(id);",
            expected: "var id = \"a\"; document.getElementById(id);",
          },
        ],
      },
      {
        name: "other selectors matching the id pattern",
        cases: [
          {
            input: "document.querySelector(\".id-foo\");",
            expected: "document.querySelector(\".id-foo\");",
          },
          {
            input: "document.querySelector(\"[id-foo]\");",
            expected: "document.querySelector(\"[id-foo]\");",
          },
        ],
      },
      {
        name: "reserved names",
        cases: [
          ...[
            "document.querySelector(\"#%s\");",
            "document.getElementById(\"%s\");",
          ].map((input) => ({
            input: printf(input, "id-foo"),
            expected: printf(input, "b"),
            reserved: ["a"],
          })),
          ...[
            "document.querySelector(\"#%s\");",
            "document.getElementById(\"%s\");",
          ].map((input) => ({
            input: printf(input, "id-foo"),
            expected: printf(input, "d"),
            reserved: ["a", "b", "c"],
          })),
          ...[
            "document.querySelector(\"#%s #%s\");",
            "document.getElementById(\"%s\");document.getElementById(\"%s\");",
          ].map((input) => ({
            input: printf(input, "id-foo", "id-bar"),
            expected: printf(input, "a", "c"),
            reserved: ["b"],
          })),
        ],
      },
      {
        name: "prefixed mangling",
        cases: [
          ...[
            "document.querySelector(\"#%s\");",
            "document.getElementById(\"%s\");",
          ].map((input) => ({
            input: printf(input, "id-foo"),
            expected: printf(input, "mangled-a"),
            prefix: "mangled-",
          })),
          ...[
            "document.querySelector(\"#%s #%s\");",
            "document.getElementById(\"%s\");document.getElementById(\"%s\");",
          ].map((input) => ({
            input: printf(input, "id-foo", "id-bar"),
            expected: printf(input, "id-a", "id-b"),
            prefix: "id-",
          })),
        ],
      },
      {
        name: "corner cases",
        cases: [
          {
            input: "document.querySelector(\"#id-foo .id-foo\");",
            expected: "document.querySelector(\"#a .id-foo\");",
            description: "non-id selectors matching a mangled id should not be mangled",
          },
          {
            input: "document.querySelector(\"#id-foo #id-foo\");",
            expected: "document.querySelector(\"#a #a\");",
            description: "repeated ids should all be mangled",
          },
          {
            input: "var id_foo;",
            expected: "var id_foo;",
            pattern: "id[-_][a-z]+",
            description: "non-string matching parts of code should not be mangled",
          },
        ],
      },
    ];

    for (const { name, cases } of scenarios) {
      test(name, function() {
        for (const testCase of cases) {
          const {
            input,
            expected,
            pattern: idNamePattern,
            reserved: reservedIds,
            prefix: keepIdPrefix,
            description: failureMessage,
          } = testCase;

          const htmlIdMangler = new HtmlIdMangler({
            idNamePattern: idNamePattern || DEFAULT_PATTERN,
            reservedIds: reservedIds,
            keepIdPrefix: keepIdPrefix,
          });
          htmlIdMangler.use(builtInLanguageSupport);

          const files = [new WebManglerFileMock("js", input)];
          const options = htmlIdMangler.config();
          const result = mangleEngine(files, options);
          expect(result).to.have.length(1);

          const out = result[0];
          expect(out.content).to.equal(expected, failureMessage);
        }
      });
    }
  });

  suite("Configuration", function() {
    test("default patterns", function() {
      const expected = HtmlIdMangler.DEFAULT_PATTERNS;

      const cssClassMangler = new HtmlIdMangler();
      const result = cssClassMangler.config();
      expect(result).to.deep.include({ patterns: expected });
    });

    test("custom pattern", function() {
      const pattern = "foo(bar|baz)-[a-z]+";

      const cssClassMangler = new HtmlIdMangler({ idNamePattern: pattern });
      const result = cssClassMangler.config();
      expect(result).to.deep.include({ patterns: pattern });
    });

    test("custom patterns", function() {
      const patterns: string[] = ["foobar-[a-z]+", "foobaz-[a-z]+"];

      const cssClassMangler = new HtmlIdMangler({ idNamePattern: patterns });
      const result = cssClassMangler.config();
      expect(result).to.deep.include({ patterns: patterns });
    });

    test("default reserved", function() {
      const expected = HtmlIdMangler.DEFAULT_RESERVED;

      const cssClassMangler = new HtmlIdMangler();
      const result = cssClassMangler.config();
      expect(result).to.deep.include({ reservedNames: expected });
    });

    test("custom reserved", function() {
      const reserved: string[] = ["foo", "bar"];

      const cssClassMangler = new HtmlIdMangler({ reservedIds: reserved });
      const result = cssClassMangler.config();
      expect(result).to.deep.include({ reservedNames: reserved });
    });

    test("default prefix", function() {
      const expected = HtmlIdMangler.DEFAULT_PREFIX;

      const cssClassMangler = new HtmlIdMangler();
      const result = cssClassMangler.config();
      expect(result).to.deep.include({ manglePrefix: expected });
    });

    test("custom prefix", function() {
      const prefix = "foobar";

      const cssClassMangler = new HtmlIdMangler({ keepIdPrefix: prefix });
      const result = cssClassMangler.config();
      expect(result).to.deep.include({ manglePrefix: prefix });
    });
  });

  test("deprecated mangle function", function() {
    const files = [new WebManglerFileMock("css", "#foobar { }")];
    const patterns = ["foo[a-z]+"];
    const reserved = ["a"];
    const prefix = "foobar";

    const htmlIdMangler = new HtmlIdMangler({
      idNamePattern: patterns,
      reservedIds: reserved,
      keepIdPrefix: prefix,
    });
    htmlIdMangler.use(builtInLanguageSupport);
    htmlIdMangler.mangle(EngineMock, files);
    expect(EngineMock).to.have.been.calledWith(
      files,
      htmlIdMangler.expressions,
      patterns,
      sinon.match.has("charSet", HtmlIdMangler.CHARACTER_SET)
        .and(sinon.match.has("reservedNames", reserved))
        .and(sinon.match.has("manglePrefix", prefix)),
    );
  });
});
