import type { TestScenario } from "@webmangler/testing";
import type { TestCase } from "./types";

import { expect, use as chaiUse } from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import {
  ATTRIBUTE_SELECTORS,
  PSEUDO_ELEMENT_SELECTORS,
  PSEUDO_SELECTORS,
} from "./css-selectors";
import {
  getArrayOfFormattedStrings,
  isValidClassName,
  varyQuotes,
  varySpacing,
} from "./test-helpers";

import EngineMock from "../../__mocks__/engine.mock";
import ManglerFileMock from "../../__mocks__/mangler-file.mock";

import BuiltInLanguageSupport from "../../languages/builtin";
import mangleEngine from "../../engine";
import CssClassMangler from "../css-classes";

const builtInLanguageSupport = new BuiltInLanguageSupport();

const DEFAULT_PATTERN = "cls[-_][a-zA-Z-_]+";
const SELECTORS: [string, string][] = [
  ["div", "div"],
  ["#foobar", "#foobar"],
  [".foobar", ".foobar"],
  ["[data-foo]", "[data-foo]"],
  [".cls-foobar", ".a"],
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
  ["div", ".cls-foo", "div", ".a"],
  [".cls-foo", "div", ".a", "div"],
  ["#foo", ".cls-bar", "#foo", ".a"],
  [".cls-foo", "#bar", ".a", "#bar"],
  [".foo", ".cls-bar", ".foo", ".a"],
  [".cls-foo", ".bar", ".a", ".bar"],
  [".cls-foo", ".cls-bar", ".a", ".b"],
  [".cls-foo", ".cls-foo", ".a", ".a"],
];

chaiUse(sinonChai);

suite("CSS Classes Mangler", function() {
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
            input: ".cls-foo { color: red; }",
            expected: ".a { color: red; }",
          },
          {
            input: ".cls-foo { font-size: 12px; } .cls-bar { font-weight: bold; }",
            expected: ".a { font-size: 12px; } .b { font-weight: bold; }",
          },
          {
            input: ":root { } .cls-foo { } .cls-bar { }",
            expected: ":root { } .a { } .b { }",
          },
          {
            input: ".cls-foo { } div { } .cls-bar { }",
            expected: ".a { } div { } .b { }",
          },
          {
            input: ".cls-foo { } .cls-bar { } span { }",
            expected: ".a { } .b { } span { }",
          },
          {
            input: ":root { } .cls-foo { } div { } .cls-bar { }",
            expected: ":root { } .a { } div { } .b { }",
          },
          {
            input: ":root { } .cls-foo { } .cls-bar { } span { }",
            expected: ":root { } .a { } .b { } span { }",
          },
          {
            input: ".cls-foo { } div { } .cls-bar { } span { }",
            expected: ".a { } div { } .b { } span { }",
          },
          {
            input: ":root { } .cls-foo { } div { } .cls-bar { } span { }",
            expected: ":root { } .a { } div { } .b { } span { }",
          },
          {
            input: ".cls-praise { } .cls-the { } .cls-sun { }",
            expected: ".a { } .b { } .c { }",
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
        name: "or operator",
        cases: [
          ...SELECTOR_PAIRS
            .map(([beforeA, beforeB, afterA, afterB]): TestCase => ({
              input: `${beforeA},${beforeB} { }`,
              expected: `${afterA},${afterB} { }`,
            }))
            .map((testCase) => varySpacing(",", testCase))
            .flat(),
        ],
      },
      {
        name: "and operator",
        cases: [
          ...SELECTOR_PAIRS
            .map(([beforeA, beforeB, afterA, afterB]): TestCase => ({
              input: `${beforeA}${beforeB} { }`,
              expected: `${afterA}${afterB} { }`,
            }))
            .filter((testCase) => !testCase.expected.match(/\.a[a-z]+/)),
        ],
      },
      {
        name: "not operator",
        cases: [
          ...SELECTORS
            .map(([selectorBefore, selectorAfter]): TestCase => ({
              input: `:not(${selectorBefore}) { }`,
              expected: `:not(${selectorAfter}) { }`,
            }))
            .map((testCase) => varySpacing(["(", ")"], testCase))
            .flat(),
          ...SELECTOR_PAIRS
            .map(([beforeA, beforeB, afterA, afterB]): TestCase => ({
              input: `${beforeA}:not(${beforeB}) { }`,
              expected: `${afterA}:not(${afterB}) { }`,
            }))
            .map((testCase) => varySpacing(["(", ")"], testCase))
            .flat(),
        ],
      },
      {
        name: "descendent combinator",
        cases: [
          ...SELECTOR_PAIRS.
            map(([beforeA, beforeB, afterA, afterB]): TestCase => ({
              input: `${beforeA} ${beforeB} { }`,
              expected: `${afterA} ${afterB} { }`,
            })),
        ],
      },
      {
        name: "child combinator",
        cases: [
          ...SELECTOR_PAIRS
            .map(([beforeA, beforeB, afterA, afterB]): TestCase => ({
              input: `${beforeA}>${beforeB} { }`,
              expected: `${afterA}>${afterB} { }`,
            }))
            .map((testCase) => varySpacing(">", testCase))
            .flat(),
        ],
      },
      {
        name: "sibling combinator",
        cases: [
          ...SELECTOR_PAIRS
            .map(([beforeA, beforeB, afterA, afterB]): TestCase => ({
              input: `${beforeA}+${beforeB} { }`,
              expected: `${afterA}+${afterB} { }`,
            }))
            .map((testCase) => varySpacing("+", testCase))
            .flat(),
        ],
      },
      {
        name: "general sibling combinator",
        cases: [
          ...SELECTOR_PAIRS.map(([beforeA, beforeB, afterA, afterB]): TestCase => ({
            input: `${beforeA}~${beforeB} { }`,
            expected: `${afterA}~${afterB} { }`,
          }))
          .map((testCase) => varySpacing("~", testCase))
          .flat(),
        ],
      },
      {
        name: "non-class selectors that match the pattern(s)",
        cases: [
          {
            input: "div { } .div { }",
            expected: "div { } .a { }",
            pattern: "[a-zA-Z-]+",
          },
          {
            input: "#cls-foo { } .cls-foo { }",
            expected: "#cls-foo { } .a { }",
          },
          ...ATTRIBUTE_SELECTORS
            .filter(isValidClassName)
            .map((s: string): TestCase => ({
              input: `div[${s}] { } .${s} { }`,
              expected: `div[${s}] { } .a { }`,
              pattern: "[a-zA-Z-]+",
            })),
          ...PSEUDO_SELECTORS
            .filter(isValidClassName)
            .map((s: string): TestCase => ({
              input: `input:${s} { } .${s} { }`,
              expected: `input:${s} { } .a { }`,
              pattern: "[a-zA-Z-]+",
            })),
          ...PSEUDO_ELEMENT_SELECTORS
            .filter(isValidClassName)
            .map((s: string): TestCase => ({
              input: `div::${s} { } .${s} { }`,
              expected: `div::${s} { } .a { }`,
              pattern: "[a-zA-Z-]+",
            })),
        ],
      },
      {
        name: "corner cases",
        cases: [
          {
            input: ".cls-foo",
            expected: ".cls-foo",
            description: "Unclear what should happen with dangling classes...",
          },
          {
            input: "div{}.cls-foo{}",
            expected: "div{}.a{}",
            description: "no space between closing `}` and class `.` should not matter",
          },
          ...["div { content: \".cls-foo\" }", "div[data-foo=\".cls-bar\"] { }"]
            .map((testCase): TestCase => ({
              input: testCase,
              expected: testCase,
            }))
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
            pattern: classNamePattern,
            reserved: reservedClassNames,
            prefix: keepClassNamePrefix,
            description: failureMessage,
          } = testCase;

          const cssClassMangler = new CssClassMangler({
            classNamePattern: classNamePattern || DEFAULT_PATTERN,
            reservedClassNames: reservedClassNames,
            keepClassNamePrefix: keepClassNamePrefix,
          });
          cssClassMangler.use(builtInLanguageSupport);

          const files = [new ManglerFileMock("css", input)];
          const result = cssClassMangler.mangle(mangleEngine, files);
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
        name: "non-class attributes",
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
            input: "<div id=\"foobar\"></div>",
            expected: "<div id=\"foobar\"></div>",
          }),
          ...varyQuotes("html", {
            input: "<div data-foo=\"bar\"></div>",
            expected: "<div data-foo=\"bar\"></div>",
          }),
        ],
      },
      {
        name: "class attribute with one class",
        cases: [
          ...varySpacing("=", {
            input: "<div class=\"cls-foo\"></div>",
            expected: "<div class=\"a\"></div>",
          }),
          ...varySpacing("\"", {
            input: "<div class=\"cls-foo\"></div>",
            expected: "<div class=\"a\"></div>",
          }),
          ...varyQuotes("html", {
            input: "<div class=\"cls-foo\"></div>",
            expected: "<div class=\"a\"></div>",
          }),
          {
            input: "<img class=\"cls-foo\"/>",
            expected: "<img class=\"a\"/>",
          },
          {
            input: "<p class=\"cls-foo\">Hello world!</p>",
            expected: "<p class=\"a\">Hello world!</p>",
          },
          {
            input: "<div id=\"foo\" class=\"cls-bar\"></div>",
            expected: "<div id=\"foo\" class=\"a\"></div>",
          },
          {
            input: "<div class=\"cls-foo\" data-foo=\"bar\"></div>",
            expected: "<div class=\"a\" data-foo=\"bar\"></div>",
          },
          {
            input: "<div id=\"foo\" class=\"cls-bar\" data-foo=\"bar\"></div>",
            expected: "<div id=\"foo\" class=\"a\" data-foo=\"bar\"></div>",
          },
        ],
      },
      {
        name: "class attribute with multiple classes",
        cases: [
          ...varySpacing("\"", {
            input: "<div class=\"cls-foo cls-bar\"></div>",
            expected: "<div class=\"a b\"></div>",
          }),
          ...varyQuotes("html", {
            input: "<div class=\"cls-foo cls-bar\"></div>",
            expected: "<div class=\"a b\"></div>",
          }),
          {
            input: "<img class=\"cls-foo cls-bar\"/>",
            expected: "<img class=\"a b\"/>",
          },
          {
            input: "<p class=\"cls-foo cls-bar\">Hello world!</p>",
            expected: "<p class=\"a b\">Hello world!</p>",
          },
          {
            input: "<div id=\"foo\" class=\"cls-foo cls-bar\"></div>",
            expected: "<div id=\"foo\" class=\"a b\"></div>",
          },
          {
            input: "<div class=\"cls-foo cls-bar\" data-foo=\"bar\"></div>",
            expected: "<div class=\"a b\" data-foo=\"bar\"></div>",
          },
          {
            input: "<div id=\"foo\" class=\"cls-foo cls-bar\" data-foo=\"bar\"></div>",
            expected: "<div id=\"foo\" class=\"a b\" data-foo=\"bar\"></div>",
          },
          {
            input: "<div class=\"cls-praise cls-the cls-sun\"></div>",
            expected: "<div class=\"a b c\"></div>",
          },
        ],
      },
      {
        name: "adjacent elements with class attribute",
        cases: [
          {
            input: `
              <div class="cls-foo"></div>
              <div class="cls-bar"></div>
            `,
            expected: `
              <div class="a"></div>
              <div class="b"></div>
            `,
          },
          {
            input: `
              <div></div>
              <div class="cls-foo"></div>
              <div class="cls-bar"></div>
            `,
            expected: `
              <div></div>
              <div class="a"></div>
              <div class="b"></div>
            `,
          },
          {
            input: `
              <div class="cls-foo"></div>
              <div></div>
              <div class="cls-bar"></div>
            `,
            expected: `
              <div class="a"></div>
              <div></div>
              <div class="b"></div>
            `,
          },
          {
            input: `
              <div class="cls-foo"></div>
              <div class="cls-bar"></div>
              <div></div>
            `,
            expected: `
              <div class="a"></div>
              <div class="b"></div>
              <div></div>
            `,
          },
          {
            input: `
              <div></div>
              <div class="cls-foo"></div>
              <div></div>
              <div class="cls-bar"></div>
            `,
            expected: `
              <div></div>
              <div class="a"></div>
              <div></div>
              <div class="b"></div>
            `,
          },
          {
            input: `
              <div></div>
              <div class="cls-foo"></div>
              <div class="cls-bar"></div>
              <div></div>
            `,
            expected: `
              <div></div>
              <div class="a"></div>
              <div class="b"></div>
              <div></div>
            `,
          },
          {
            input: `
              <div></div>
              <div class="cls-foo"></div>
              <div></div>
              <div class="cls-bar"></div>
              <div></div>
            `,
            expected: `
              <div></div>
              <div class="a"></div>
              <div></div>
              <div class="b"></div>
              <div></div>
            `,
          },
          {
            input: `
              <div class="cls-praise"></div>
              <div></div>
              <div class="cls-the"></div>
              <div></div>
              <div class="cls-sun"></div>
            `,
            expected: `
              <div class="a"></div>
              <div></div>
              <div class="b"></div>
              <div></div>
              <div class="c"></div>
            `,
          },
        ],
      },
      {
        name: "nested elements with class attribute",
        cases: [
          {
            input: `
              <div class="cls-foo">
                <p></p>
              </div>
            `,
            expected: `
              <div class="a">
                <p></p>
              </div>
            `,
          },
          {
            input: `
              <div>
                <p class="cls-bar"></p>
              </div>
            `,
            expected: `
              <div>
                <p class="a"></p>
              </div>
            `,
          },
          {
            input: `
              <div class="cls-foo">
                <p class="cls-bar"></p>
              </div>
            `,
            expected: `
              <div class="a">
                <p class="b"></p>
              </div>
            `,
          },
          {
            input: `
              <div>
                <p>
                  <b class="cls-foobar"></b>
                </p>
              </div>
            `,
            expected: `
              <div>
                <p>
                  <b class="a"></b>
                </p>
              </div>
            `,
          },
          {
            input: `
              <div class="cls-foo">
                <p class="cls-bar">
                  <b></b>
                </p>
              </div>
            `,
            expected: `
              <div class="a">
                <p class="b">
                  <b></b>
                </p>
              </div>
            `,
          },
          {
            input: `
              <div class="cls-foo">
                <p>
                  <b class="cls-bar"></b>
                </p>
              </div>
            `,
            expected: `
              <div class="a">
                <p>
                  <b class="b"></b>
                </p>
              </div>
            `,
          },
          {
            input: `
              <div>
                <p class="cls-foo">
                  <b class="cls-bar"></b>
                </p>
              </div>
            `,
            expected: `
              <div>
                <p class="a">
                  <b class="b"></b>
                </p>
              </div>
            `,
          },
          {
            input: `
              <div class="cls-praise">
                <p class="cls-the">
                  <b class="cls-sun"></b>
                </p>
              </div>
            `,
            expected: `
              <div class="a">
                <p class="b">
                  <b class="c"></b>
                </p>
              </div>
            `,
          },
        ],
      },
      {
        name: "corner cases",
        cases: [
          {
            input: "<div class></div>",
            expected: "<div class></div>",
          },
          ...varyQuotes("html", {
            input: "<div class=\"\"></div>",
            expected: "<div class=\"\"></div>",
          }),
          {
            input: "<p>cls-foo</p>",
            expected: "<p>cls-foo</p>",
            description: "Anything inside tags matching the pattern should be ignored.",
          },
          {
            input: "<p>.cls-foo</p>",
            expected: "<p>.cls-foo</p>",
            description: "Anything inside tags matching the pattern should be ignored.",
          },
          {
            input: "<div class=\"cls-foo\" class=\"cls-bar\"></div>",
            expected: "<div class=\"a\" class=\"b\"></div>",
            description: "multiple class attributes on one element should all be mangled",
          },
          {
            input: "<div class=\"cls-foo cls-foo\"></div>",
            expected: "<div class=\"a a\"></div>",
            description: "multiple class attributes on one element should all be mangled",
          },
          ...["data-", "x"]
            .map((prefix): TestCase => ({
              input: `<div ${prefix}class="cls-foo"></div>`,
              expected: `<div ${prefix}class="cls-foo"></div>`,
              description: "Shouldn't mangle in attribute even if it ends in \"class\"",
            })),
          {
            input: "<class id=\"foo\"></class>",
            expected: "<class id=\"foo\"></class>",
            description: "The tag \"class\" shouldn't cause problems.",
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
            pattern: classNamePattern,
            reserved: reservedClassNames,
            prefix: keepClassNamePrefix,
            description: failureMessage,
          } = testCase;

          const cssClassMangler = new CssClassMangler({
            classNamePattern: classNamePattern || DEFAULT_PATTERN,
            reservedClassNames: reservedClassNames,
            keepClassNamePrefix: keepClassNamePrefix,
          });
          cssClassMangler.use(builtInLanguageSupport);

          const files = [new ManglerFileMock("html", input)];
          const result = cssClassMangler.mangle(mangleEngine, files);
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
        name: "query selectors with one selector",
        cases: [
          ...SELECTORS
            .map(([before, after]): TestCase => ({
              input: `document.querySelectorAll("${before}");`,
              expected: `document.querySelectorAll("${after}");`,
            }))
            .map((testCase) => varySpacing("\"", testCase))
            .flat()
            .map((testCase) => varyQuotes("js", testCase))
            .flat(),
          ...varySpacing("\"", {
            input: `
              document.querySelectorAll(".cls-foo");
              document.querySelectorAll(".cls-bar");
            `,
            expected: `
              document.querySelectorAll(".a");
              document.querySelectorAll(".b");
            `,
          }),
          ...varyQuotes("js", {
            input: `
              document.querySelectorAll(".cls-foo");
              document.querySelectorAll(".cls-bar");
            `,
            expected: `
              document.querySelectorAll(".a");
              document.querySelectorAll(".b");
            `,
          }),
        ],
      },
      {
        name: "query selector with attribute selector",
        cases: [
          ...SELECTORS
            .map(([selectorBefore, selectorAfter]): TestCase[] => [
              ...ATTRIBUTE_SELECTORS.map((attributeSelector: string): TestCase => ({
                input: `querySelectorAll("${selectorBefore}[${attributeSelector}]");`,
                expected: `querySelectorAll("${selectorAfter}[${attributeSelector}]");`,
              })),
            ])
            .flat(),
        ],
      },
      {
        name: "query selector with or operator",
        cases: [
          ...SELECTOR_PAIRS
            .map(([beforeA, beforeB, afterA, afterB]): TestCase => ({
              input: `document.querySelectorAll("${beforeA},${beforeB}");`,
              expected: `document.querySelectorAll("${afterA},${afterB}");`,
            }))
            .map((testCase) => varySpacing(",", testCase))
            .flat(),
        ],
      },
      {
        name: "query selector with and operator",
        cases: [
          ...SELECTOR_PAIRS
            .map(([beforeA, beforeB, afterA, afterB]): TestCase => ({
              input: `document.querySelectorAll("${beforeA}${beforeB}");`,
              expected: `document.querySelectorAll("${afterA}${afterB}");`,
            }))
            .filter((testCase) => !testCase.expected.match(/\.a[a-z]+/)),
        ],
      },
      {
        name: "query selector with not operator",
        cases: [
          ...SELECTORS
            .map(([selectorBefore, selectorAfter]): TestCase => ({
              input: `document.querySelectorAll(":not(${selectorBefore})");`,
              expected: `document.querySelectorAll(":not(${selectorAfter})");`,
            }))
            .map((testCase) => varySpacing(["(", ")"], testCase))
            .flat(),
          ...SELECTOR_PAIRS
            .map(([beforeA, beforeB, afterA, afterB]): TestCase => ({
              input: `document.querySelectorAll("${beforeA}:not(${beforeB})");`,
              expected: `document.querySelectorAll("${afterA}:not(${afterB})");`,
            }))
            .map((testCase) => varySpacing(["(", ")"], testCase))
            .flat(),
        ],
      },
      {
        name: "query selector with descendent combinator",
        cases: [
          ...SELECTOR_PAIRS.
            map(([beforeA, beforeB, afterA, afterB]): TestCase => ({
              input: `document.querySelectorAll("${beforeA} ${beforeB}");`,
              expected: `document.querySelectorAll("${afterA} ${afterB}");`,
            })),
        ],
      },
      {
        name: "query selector with child combinator",
        cases: [
          ...SELECTOR_PAIRS
            .map(([beforeA, beforeB, afterA, afterB]): TestCase => ({
              input: `document.querySelectorAll("${beforeA}>${beforeB}");`,
              expected: `document.querySelectorAll("${afterA}>${afterB}");`,
            }))
            .map((testCase) => varySpacing(">", testCase))
            .flat(),
        ],
      },
      {
        name: "query selector with sibling combinator",
        cases: [
          ...SELECTOR_PAIRS
            .map(([beforeA, beforeB, afterA, afterB]): TestCase => ({
              input: `document.querySelectorAll("${beforeA}+${beforeB}");`,
              expected: `document.querySelectorAll("${afterA}+${afterB}");`,
            }))
            .map((testCase) => varySpacing("+", testCase))
            .flat(),
        ],
      },
      {
        name: "query selector with general sibling combinator",
        cases: [
          ...SELECTOR_PAIRS
            .map(([beforeA, beforeB, afterA, afterB]): TestCase => ({
              input: `document.querySelectorAll("${beforeA}~${beforeB}");`,
              expected: `document.querySelectorAll("${afterA}~${afterB}");`,
            }))
            .map((testCase) => varySpacing("~", testCase))
            .flat(),
        ],
      },
      {
        name: "class manipulation",
        cases: [
          ...["add", "toggle", "remove"]
            .map((method): TestCase => ({
              input: `$el.classList.${method}("cls-foobar");`,
              expected: `$el.classList.${method}("a");`,
            }))
            .map((testCase) => varySpacing("\"", testCase))
            .flat()
            .map((testCase) => varyQuotes("js", testCase))
            .flat(),
          ...["add", "toggle", "remove"]
            .map((method): TestCase => ({
              input: `var c = "cls-foobar"; $el.classList.${method}(c);`,
              expected: `var c = "a"; $el.classList.${method}(c);`,
            }))
            .map((testCase) => varySpacing("\"", testCase))
            .flat()
            .map((testCase) => varyQuotes("js", testCase))
            .flat(),
          ...["add", "remove"]
            .map((method): TestCase => ({
              input: `$el.classList.${method}("cls-foo", "cls-bar");`,
              expected: `$el.classList.${method}("a", "b");`,
            }))
            .map((testCase) => varySpacing("\"", testCase))
            .flat()
            .map((testCase) => varyQuotes("js", testCase))
            .flat(),
          ...["add", "toggle", "remove"]
            .map((method): TestCase => ({
              input: `$el.classList.${method}("foobar");`,
              expected: `$el.classList.${method}("foobar");`,
            }))
            .map((testCase) => varySpacing("\"", testCase))
            .flat()
            .map((testCase) => varyQuotes("js", testCase))
            .flat(),
        ],
      },
      {
        name: "corner cases",
        cases: [
          ...varyQuotes("js", {
            input: "var cls_foo = \"cls-foo\";",
            expected: "var cls_foo = \"a\";",
            pattern: "[a-z-_]+",
            description: `
              Anything outside quotation marks matching the pattern should be
              ignored.
            `,
          }),
          ...varyQuotes("js", {
            input: "var x = \"foo cls-foo bar\";",
            expected: "var x = \"foo cls-foo bar\";",
            description: `
              In multi-word strings, anything matching the pattern without a
              leading dot (".") should not be mangled.
            `,
          }),
        ],
      },
    ];

    for (const { name, cases } of scenarios) {
      test(name, function() {
        for (const testCase of cases) {
          const {
            input,
            expected,
            pattern: classNamePattern,
            reserved: reservedClassNames,
            prefix: keepClassNamePrefix,
            description: failureMessage,
          } = testCase;

          const cssClassMangler = new CssClassMangler({
            classNamePattern: classNamePattern || DEFAULT_PATTERN,
            reservedClassNames: reservedClassNames,
            keepClassNamePrefix: keepClassNamePrefix,
          });
          cssClassMangler.use(builtInLanguageSupport);

          const files = [new ManglerFileMock("js", input)];
          const result = cssClassMangler.mangle(mangleEngine, files);
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
      const expected = CssClassMangler.DEFAULT_PATTERNS;

      const cssClassMangler = new CssClassMangler();
      cssClassMangler.mangle(EngineMock, []);
      expect(EngineMock).to.have.been.calledWith(
        sinon.match.any,
        sinon.match.any,
        expected,
        sinon.match.any,
      );
    });

    test("custom pattern", function() {
      const pattern = "foo(bar|baz)-[a-z]+";

      const cssClassMangler = new CssClassMangler({ classNamePattern: pattern });
      cssClassMangler.mangle(EngineMock, []);
      expect(EngineMock).to.have.been.calledWith(
        sinon.match.any,
        sinon.match.any,
        pattern,
        sinon.match.any,
      );
    });

    test("custom patterns", function() {
      const patterns: string[] = ["foobar-[a-z]+", "foobaz-[a-z]+"];

      const cssClassMangler = new CssClassMangler({ classNamePattern: patterns });
      cssClassMangler.mangle(EngineMock, []);
      expect(EngineMock).to.have.been.calledWith(
        sinon.match.any,
        sinon.match.any,
        patterns,
        sinon.match.any,
      );
    });

    test("default reserved", function() {
      const expected = CssClassMangler.ALWAYS_RESERVED.concat(CssClassMangler.DEFAULT_RESERVED);

      const cssClassMangler = new CssClassMangler();
      cssClassMangler.mangle(EngineMock, []);
      expect(EngineMock).to.have.been.calledWith(
        sinon.match.any,
        sinon.match.any,
        sinon.match.any,
        sinon.match.has("reservedNames", expected),
      );
    });

    test("custom reserved", function() {
      const reserved: string[] = ["foo", "bar"];
      const expected = CssClassMangler.ALWAYS_RESERVED.concat(reserved);

      const cssClassMangler = new CssClassMangler({ reservedClassNames: reserved });
      cssClassMangler.mangle(EngineMock, []);
      expect(EngineMock).to.have.been.calledWith(
        sinon.match.any,
        sinon.match.any,
        sinon.match.any,
        sinon.match.has("reservedNames", expected),
      );
    });

    test("default prefix", function() {
      const expected = CssClassMangler.DEFAULT_PREFIX;

      const cssClassMangler = new CssClassMangler();
      cssClassMangler.mangle(EngineMock, []);
      expect(EngineMock).to.have.been.calledWith(
        sinon.match.any,
        sinon.match.any,
        sinon.match.any,
        sinon.match.has("manglePrefix", expected),
      );
    });

    test("custom prefix", function() {
      const prefix = "foobar";

      const cssClassMangler = new CssClassMangler({ keepClassNamePrefix: prefix });
      cssClassMangler.mangle(EngineMock, []);
      expect(EngineMock).to.have.been.calledWith(
        sinon.match.any,
        sinon.match.any,
        sinon.match.any,
        sinon.match.has("manglePrefix", prefix),
      );
    });
  });

  suite("Illegal names", function() {
    const illegalNames: string[] = [
      ".-", ".0", ".1", ".2", ".3", ".4", ".5", ".6", ".7", ".8", ".9",
    ];

    let content = "";

    suiteSetup(function() {
      const n = CssClassMangler.CHARACTER_SET.length;
      const nArray = getArrayOfFormattedStrings(n, ".cls-%s");
      content = `${nArray.join(",")} { }`;
    });

    test("without extra reserved", function() {
      const cssClassMangler = new CssClassMangler({
        classNamePattern: "cls-[0-9]+",
      });
      cssClassMangler.use(builtInLanguageSupport);

      const file = new ManglerFileMock("css", content);
      const result = cssClassMangler.mangle(mangleEngine, [file]);
      expect(result).to.have.lengthOf(1);

      const out = result[0];
      for (const illegalName of illegalNames) {
        expect(out.content).not.to.have.string(illegalName);
      }
    });

    test("with extra reserved", function() {
      const cssClassMangler = new CssClassMangler({
        classNamePattern: "cls-[0-9]+",
        reservedClassNames: ["a"],
      });
      cssClassMangler.use(builtInLanguageSupport);

      const file = new ManglerFileMock("css", content);
      const result = cssClassMangler.mangle(mangleEngine, [file]);
      expect(result).to.have.lengthOf(1);

      const out = result[0];
      for (const illegalName of illegalNames) {
        expect(out.content).not.to.have.string(illegalName);
      }
    });
  });

  test("no input files", function() {
    const cssClassMangler = new CssClassMangler();
    const result = cssClassMangler.mangle(mangleEngine, []);
    expect(result).to.have.lengthOf(0);
  });
});
