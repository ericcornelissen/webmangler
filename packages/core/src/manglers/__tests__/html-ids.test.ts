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
import { isValidIdName, varyQuotes, varySpacing } from "./test-helpers";

import EngineMock from "../../__mocks__/engine.mock";
import ManglerFileMock from "../../__mocks__/mangler-file.mock";

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

          const files = [new ManglerFileMock("css", input)];
          const result = htmlIdMangler.mangle(mangleEngine, files);
          expect(result).to.have.length(1);

          const out = result[0];
          expect(out.content).to.equal(expected, failureMessage);
        }
      });
    }
  });

  suite("HTML", function() {
    const scenarios: TestScenario<TestCase>[] = [
      {
        name: "single `id` attribute",
        cases: [
          ...varySpacing("=", {
            input: "<div id=\"id-foo\"></div>",
            expected: "<div id=\"a\"></div>",
          }),
          ...varyQuotes("html", {
            input: "<div id=\"id-foo\"></div>",
            expected: "<div id=\"a\"></div>",
          }),
          {
            input: "<h1 id=\"id-foo\"></h1>",
            expected: "<h1 id=\"a\"></h1>",
          },
        ],
      },
      {
        name: "`id` attribute and other attributes",
        cases: [
          {
            input: "<div class=\"foo\" id=\"id-bar\"></div>",
            expected: "<div class=\"foo\" id=\"a\"></div>",
          },
          {
            input: "<div id=\"id-foo\" class=\"bar\"></div>",
            expected: "<div id=\"a\" class=\"bar\"></div>",
          },
          {
            input: "<div data-x=\"y\" id=\"id-foo\" class=\"bar\"></div>",
            expected: "<div data-x=\"y\" id=\"a\" class=\"bar\"></div>",
          },
          {
            input: "<button disabled id=\"id-foo\"></button>",
            expected: "<button disabled id=\"a\"></button>",
          },
          {
            input: "<button id=\"id-foo\" disabled></button>",
            expected: "<button id=\"a\" disabled></button>",
          },
          {
            input: "<button aria-hidden id=\"id-foo\" disabled></button>",
            expected: "<button aria-hidden id=\"a\" disabled></button>",
          },
        ],
      },
      {
        name: "single `href` attribute",
        cases: [
          ...varySpacing("=", {
            input: "<div href=\"#id-foo\"></div>",
            expected: "<div href=\"#a\"></div>",
          }),
          ...varyQuotes("html", {
            input: "<div href=\"#id-foo\"></div>",
            expected: "<div href=\"#a\"></div>",
          }),
          {
            input: "<div href=\"www.id-foo.com/bar#id-foo\"></div>",
            expected: "<div href=\"www.id-foo.com/bar#a\"></div>",
          },
          {
            input: "<div href=\"www.id-foo.com/bar#id-foo?q=bar\"></div>",
            expected: "<div href=\"www.id-foo.com/bar#a?q=bar\"></div>",
          },
        ],
      },
      {
        name: "`href` attribute and other attributes",
        cases: [
          {
            input: "<a class=\"foo\" href=\"#id-bar\"></a>",
            expected: "<a class=\"foo\" href=\"#a\"></a>",
          },
          {
            input: "<a href=\"#id-foo\" class=\"bar\"></a>",
            expected: "<a href=\"#a\" class=\"bar\"></a>",
          },
          {
            input: "<a data-x=\"y\" href=\"#id-foo\" class=\"bar\"></a>",
            expected: "<a data-x=\"y\" href=\"#a\" class=\"bar\"></a>",
          },
          {
            input: "<a disabled href=\"#id-bar\"></a>",
            expected: "<a disabled href=\"#a\"></a>",
          },
          {
            input: "<a href=\"#id-bar\" disabled></a>",
            expected: "<a href=\"#a\" disabled></a>",
          },
          {
            input: "<a aria-hidden href=\"#id-bar\" disabled></a>",
            expected: "<a aria-hidden href=\"#a\" disabled></a>",
          },
        ],
      },
      {
        name: "reserved id names",
        cases: [
          {
            input: "<div id=\"id-foo\"></div>",
            reserved: ["a"],
            expected: "<div id=\"b\"></div>",
          },
          {
            input: "<div id=\"id-foo\"></div>",
            reserved: ["a", "b", "c"],
            expected: "<div id=\"d\"></div>",
          },
          {
            input: "<div id=\"id-foo\"><p id=\"id-bar\"></p></div>",
            reserved: ["b"],
            expected: "<div id=\"a\"><p id=\"c\"></p></div>",
          },
        ],
      },
      {
        name: "prefixed mangling",
        cases: [
          {
            input: "<div id=\"id-foo\"></div>",
            prefix: "mangled-",
            expected: "<div id=\"mangled-a\"></div>",
          },
          {
            input: "<div id=\"id-foo\"><p id=\"id-bar\"></p></div>",
            prefix: "id-",
            expected: "<div id=\"id-a\"><p id=\"id-b\"></p></div>",
          },
          {
            input: "<div id=\"foo-bar\"><p id=\"foo-baz\"></p></div>",
            pattern: "foo-[a-z]+",
            prefix: "foo-",
            expected: "<div id=\"foo-a\"><p id=\"foo-b\"></p></div>",
          },
        ],
      },
      {
        name: "input ids and mangled ids intersect",
        cases: [
          {
            input: "<p id=\"a\"><a id=\"b\"></a></p>",
            expected: "<p id=\"a\"><a id=\"b\"></a></p>",
            pattern: "[a-z]",
          },
          {
            input: "<p id=\"b\"><a id=\"a\"></a></p>",
            expected: "<p id=\"a\"><a id=\"b\"></a></p>",
            pattern: "[a-z]",
          },
          {
            input: "<p id=\"a\"><b id=\"c\"></b><a id=\"b\"></a></p>",
            expected: "<p id=\"a\"><b id=\"b\"></b><a id=\"c\"></a></p>",
            pattern: "[a-z]",
          },
        ],
      },
      {
        name: "corner cases",
        cases: [
          {
            input: "<div di=\"id-bar\"></div>",
            expected: "<div di=\"id-bar\"></div>",
            description: "the id attribute name must be correct",
          },
          {
            input: "<div data-foo=\">\" id=\"id-bar\"></div>",
            expected: "<div data-foo=\">\" id=\"a\"></div>",
            description: "early non-closing `>` should not prevent id mangling",
          },
          {
            input: "<div class=\"id-foo\"></div>",
            expected: "<div class=\"id-foo\"></div>",
            description: "matching patterns in non-id attributes should be ignored",
          },
          {
            input: "<div data-id=\"id-foo\"></div>",
            expected: "<div data-id=\"id-foo\"></div>",
            description: "matching patterns in id-like attributes should be ignored",
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

          const files = [new ManglerFileMock("html", input)];
          const result = htmlIdMangler.mangle(mangleEngine, files);
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

          const files = [new ManglerFileMock("js", input)];
          const result = htmlIdMangler.mangle(mangleEngine, files);
          expect(result).to.have.length(1);

          const out = result[0];
          expect(out.content).to.equal(expected, failureMessage);
        }
      });
    }
  });

  suite("Configuration", function() {
    setup(function() {
      EngineMock.resetHistory();
    });

    test("default patterns", function() {
      const expected = HtmlIdMangler.DEFAULT_PATTERNS;

      const htmlIdMangler = new HtmlIdMangler();
      htmlIdMangler.mangle(EngineMock, []);
      expect(EngineMock).to.have.been.calledWith(
        sinon.match.any,
        sinon.match.any,
        expected,
        sinon.match.any,
      );
    });

    test("custom pattern", function() {
      const pattern = "foo(bar|baz)-[a-z]+";

      const htmlIdMangler = new HtmlIdMangler({ idNamePattern: pattern });
      htmlIdMangler.mangle(EngineMock, []);
      expect(EngineMock).to.have.been.calledWith(
        sinon.match.any,
        sinon.match.any,
        pattern,
        sinon.match.any,
      );
    });

    test("custom patterns", function() {
      const patterns: string[] = ["foobar-[a-z]+", "foobaz-[a-z]+"];

      const htmlIdMangler = new HtmlIdMangler({ idNamePattern: patterns });
      htmlIdMangler.mangle(EngineMock, []);
      expect(EngineMock).to.have.been.calledWith(
        sinon.match.any,
        sinon.match.any,
        patterns,
        sinon.match.any,
      );
    });

    test("default reserved", function() {
      const expected = HtmlIdMangler.DEFAULT_RESERVED;

      const htmlIdMangler = new HtmlIdMangler();
      htmlIdMangler.mangle(EngineMock, []);
      expect(EngineMock).to.have.been.calledWith(
        sinon.match.any,
        sinon.match.any,
        sinon.match.any,
        sinon.match.has("reservedNames", expected),
      );
    });

    test("custom reserved", function() {
      const reserved: string[] = ["foo", "bar"];

      const htmlIdMangler = new HtmlIdMangler({ reservedIds: reserved });
      htmlIdMangler.mangle(EngineMock, []);
      expect(EngineMock).to.have.been.calledWith(
        sinon.match.any,
        sinon.match.any,
        sinon.match.any,
        sinon.match.has("reservedNames", reserved),
      );
    });

    test("default prefix", function() {
      const expected = HtmlIdMangler.DEFAULT_PREFIX;

      const htmlIdMangler = new HtmlIdMangler();
      htmlIdMangler.mangle(EngineMock, []);
      expect(EngineMock).to.have.been.calledWith(
        sinon.match.any,
        sinon.match.any,
        sinon.match.any,
        sinon.match.has("manglePrefix", expected),
      );
    });

    test("custom prefix", function() {
      const prefix = "foobar";

      const htmlIdMangler = new HtmlIdMangler({ keepIdPrefix: prefix });
      htmlIdMangler.mangle(EngineMock, []);
      expect(EngineMock).to.have.been.calledWith(
        sinon.match.any,
        sinon.match.any,
        sinon.match.any,
        sinon.match.has("manglePrefix", prefix),
      );
    });
  });

  test("no input files", function() {
    const htmlIdMangler = new HtmlIdMangler({
      idNamePattern: DEFAULT_PATTERN,
    });

    const result = htmlIdMangler.mangle(mangleEngine, []);
    expect(result).to.have.lengthOf(0);
  });
});
