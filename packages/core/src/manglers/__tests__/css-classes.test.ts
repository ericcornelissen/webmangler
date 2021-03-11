import type { TestScenario } from "@webmangler/testing";
import type {
  SelectorBeforeAndAfter,
  SelectorPairBeforeAndAfter,
  TestCase,
} from "./types";

import { expect } from "chai";

import {
  ATTRIBUTE_SELECTORS,
  PSEUDO_ELEMENT_SELECTORS,
  PSEUDO_SELECTORS,
  SELECTOR_COMBINATORS,
} from "./css-constants";
import { SELF_CLOSING_TAGS, STANDARD_TAGS } from "./html-constants";
import {
  getArrayOfFormattedStrings,
  isValidClassName,
  varyQuotes,
  varySpacing,
} from "./test-helpers";

import WebManglerFileMock from "../../__mocks__/web-mangler-file.mock";

import { ALL_CHARS } from "../../characters";
import mangleEngine from "../../engine";
import { getExpressions } from "../../index";
import BuiltInLanguageSupport from "../../languages/builtin";
import CssClassMangler from "../css-classes";

const builtInLanguages = [new BuiltInLanguageSupport()];

const DEFAULT_PATTERN = "cls-[a-z]+";
const SELECTORS: SelectorBeforeAndAfter[] = [
  { before: ":root", after: ":root" },
  { before: "div", after: "div" },
  { before: "#foobar", after: "#foobar" },
  { before: ".foobar", after: ".foobar" },
  { before: "[data-foobar]", after: "[data-foobar]" },
  { before: ".cls-foobar", after: ".a" },
];
const SELECTOR_PAIRS: SelectorPairBeforeAndAfter[] = [
  { beforeA: "div", beforeB: "span", afterA: "div", afterB: "span" },
  { beforeA: "#foo", beforeB: "#bar", afterA: "#foo", afterB: "#bar" },
  { beforeA: ".foo", beforeB: ".bar", afterA: ".foo", afterB: ".bar" },
  { beforeA: "div", beforeB: "#foobar", afterA: "div", afterB: "#foobar" },
  { beforeA: "div", beforeB: ".foobar", afterA: "div", afterB: ".foobar" },
  { beforeA: "#foo", beforeB: ".bar", afterA: "#foo", afterB: ".bar" },
  { beforeA: ".foo", beforeB: "#bar", afterA: ".foo", afterB: "#bar" },
  { beforeA: "#foobar", beforeB: "div", afterA: "#foobar", afterB: "div" },
  { beforeA: ".foobar", beforeB: "div", afterA: ".foobar", afterB: "div" },
  { beforeA: "div", beforeB: ".cls-foo", afterA: "div", afterB: ".a" },
  { beforeA: ".cls-foo", beforeB: "div", afterA: ".a", afterB: "div" },
  { beforeA: ".foo", beforeB: ".cls-bar", afterA: ".foo", afterB: ".a" },
  { beforeA: ".cls-foo", beforeB: ".bar", afterA: ".a", afterB: ".bar" },
  { beforeA: "#foo", beforeB: ".cls-bar", afterA: "#foo", afterB: ".a" },
  { beforeA: ".cls-foo", beforeB: "#bar", afterA: ".a", afterB: "#bar" },
  { beforeA: ".cls-foo", beforeB: ".cls-bar", afterA: ".a", afterB: ".b" },
  { beforeA: ".cls-foobar", beforeB: ".cls-foobar", afterA: ".a", afterB: ".a" },
];

suite("CSS Class Mangler", function() {
  suite("CSS", function() {
    const scenarios: TestScenario<TestCase>[] = [
      {
        name: "individual selectors",
        cases: SELECTORS
          .flatMap(({ before, after }): TestCase[] => [
            {
              input: `${before} { }`,
              expected: `${after} { }`,
            },
            {
              input: `:not(${before}) { }`,
              expected: `:not(${after}) { }`,
            },
            {
              input: `${before} { color: red; }`,
              expected: `${after} { color: red; }`,
            },
            ...PSEUDO_SELECTORS
              .flatMap((pseudoSelector: string): TestCase[] => [
                {
                  input: `${before}:${pseudoSelector} { }`,
                  expected: `${after}:${pseudoSelector} { }`,
                },
              ]),
            ...PSEUDO_ELEMENT_SELECTORS
              .flatMap((pseudoElement: string): TestCase[] => [
                {
                  input: `${before}:${pseudoElement} { }`,
                  expected: `${after}:${pseudoElement} { }`,
                },
              ]),
            ...ATTRIBUTE_SELECTORS
              .flatMap((attributeSelector: string): TestCase[] => [
                {
                  input: `${before}[${attributeSelector}] { }`,
                  expected: `${after}[${attributeSelector}] { }`,
                },
              ]),
          ]),
      },
      {
        name: "multiple selectors",
        cases: SELECTOR_PAIRS
          .flatMap(({ beforeA, beforeB, afterA, afterB }): TestCase[] => [
            {
              input: `${beforeA} { } ${beforeB} { }`,
              expected: `${afterA} { } ${afterB} { }`,
            },
            ...SELECTOR_COMBINATORS
              .filter((combinator: string): boolean => combinator !== "")
              .flatMap((combinator: string): TestCase[] => [
                ...varySpacing(combinator, {
                  input: `${beforeA}${combinator}${beforeB} { }`,
                  expected: `${afterA}${combinator}${afterB} { }`,
                }),
              ]),
            {
              input: `
                ${beforeA} { font-size: 12px; }
                ${beforeB} { font-weight: bold; }
              `,
              expected: `
                ${afterA} { font-size: 12px; }
                ${afterB} { font-weight: bold; }
              `,
            },
            {
              input: `:root { } ${beforeA} { } ${beforeB} { }`,
              expected: `:root { } ${afterA} { } ${afterB} { }`,
            },
            {
              input: `${beforeA} { } div { } ${beforeB} { }`,
              expected: `${afterA} { } div { } ${afterB} { }`,
            },
            {
              input: `${beforeA} { } ${beforeB} { } span { }`,
              expected: `${afterA} { } ${afterB} { } span { }`,
            },
            {
              input: `:root { } ${beforeA} { } div { } ${beforeB} { }`,
              expected: `:root { } ${afterA} { } div { } ${afterB} { }`,
            },
            {
              input: `:root { } ${beforeA} { } ${beforeB} { } span { }`,
              expected: `:root { } ${afterA} { } ${afterB} { } span { }`,
            },
            {
              input: `${beforeA} { } div { } ${beforeB} { } span { }`,
              expected: `${afterA} { } div { } ${afterB} { } span { }`,
            },
            {
              input: `
                :root { }
                ${beforeA} { }
                div { }
                ${beforeB} { }
                span { }
              `,
              expected: `
                :root { }
                ${afterA} { }
                div { }
                ${afterB} { }
                span { }
              `,
            },
          ]),
      },
      {
        name: "other selectors that match the pattern(s)",
        cases: [
          {
            input: "div { } .div { }",
            expected: "div { } .a { }",
            pattern: "[a-z]+",
          },
          {
            input: "#cls-foo { } .cls-foo { }",
            expected: "#cls-foo { } .a { }",
          },
          ...PSEUDO_SELECTORS
            .filter(isValidClassName)
            .flatMap((pseudoSelector: string): TestCase[] => [
              {
                input: `input:${pseudoSelector} { } .${pseudoSelector} { }`,
                expected: `input:${pseudoSelector} { } .a { }`,
                pattern: "[a-zA-Z-]+",
              },
            ]),
          ...PSEUDO_ELEMENT_SELECTORS
            .filter(isValidClassName)
            .flatMap((pseudoElement: string): TestCase[] => [
              {
                input: `div::${pseudoElement} { } .${pseudoElement} { }`,
                expected: `div::${pseudoElement} { } .a { }`,
                pattern: "[a-zA-Z-]+",
              },
            ]),
          ...ATTRIBUTE_SELECTORS
            .filter(isValidClassName)
            .flatMap((attributeSelector: string): TestCase[] => [
              {
                input: `
                  div[${attributeSelector}] { }
                  .${attributeSelector} { }
                `,
                expected: `
                  div[${attributeSelector}] { }
                  .a { }
                `,
                pattern: "[a-zA-Z-]+",
              },
            ]),
        ],
      },
      {
        name: "strings that match the pattern",
        cases: [
          ...varySpacing("css", {
            input: "div { content: \".cls-foo\"; } .cls-foo { }",
            expected: "div { content: \".cls-foo\"; } .a { }",
          }),
          ...varySpacing("css", {
            input: "div[data-foo=\".cls-foo\"] { } .cls-foo { }",
            expected: "div[data-foo=\".cls-foo\"] { } .a { }",
          }),
        ],
      },
      {
        name: "edge cases",
        cases: [
          {
            input: ".cls-foo",
            expected: ".a",
            description: "dangling class selectors should be mangled",
          },
          {
            input: "div{}.cls-foo{}",
            expected: "div{}.a{}",
            description: "lack of spacing around curly braces should not prevent mangling",
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

          const files = [new WebManglerFileMock("css", input)];

          const cssClassMangler = new CssClassMangler({
            classNamePattern: classNamePattern || DEFAULT_PATTERN,
            reservedClassNames: reservedClassNames,
            keepClassNamePrefix: keepClassNamePrefix,
          });
          const options = cssClassMangler.options();
          const expressions = getExpressions(
            builtInLanguages,
            options.expressionOptions,
          );

          const result = mangleEngine(files, expressions, options);
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
          ...STANDARD_TAGS
            .map((tag) => ({
              input: `<${tag} class="cls-foo"></${tag}>`,
              expected: `<${tag} class="a"></${tag}>`,
            })),
          ...SELF_CLOSING_TAGS
            .map((tag) => ({
              input: `<${tag} class="cls-foo"/>`,
              expected: `<${tag} class="a"/>`,
            })),
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
          {
            input: "<div disabled class=\"cls-foo\"></div>",
            expected: "<div disabled class=\"a\"></div>",
          },
          {
            input: "<div class=\"cls-foo\" aria-hidden></div>",
            expected: "<div class=\"a\" aria-hidden></div>",
          },
          {
            input: "<div disabled class=\"cls-foo\" aria-hidden></div>",
            expected: "<div disabled class=\"a\" aria-hidden></div>",
          },
          {
            input: "<div id=\"foo\" class=\"cls-bar\" aria-hidden></div>",
            expected: "<div id=\"foo\" class=\"a\" aria-hidden></div>",
          },
          {
            input: "<div disabled class=\"cls-foo\" data-foo=\"bar\"></div>",
            expected: "<div disabled class=\"a\" data-foo=\"bar\"></div>",
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
        name: "non-class attributes that match the pattern",
        cases: [
          {
            input: "<div id=\"cls-foo\" class=\"cls-foo\"></div>",
            expected: "<div id=\"cls-foo\" class=\"a\"></div>",
          },
          {
            input: "<div id=\"cls-foo\"></div><div class=\"cls-foo\"></div>",
            expected: "<div id=\"cls-foo\"></div><div class=\"a\"></div>",
          },
        ],
      },
      {
        name: "edge cases",
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
            description: "anything inside tags matching the pattern should be ignored",
          },
          {
            input: "<p>.cls-foo</p>",
            expected: "<p>.cls-foo</p>",
            description: "anything inside tags matching the pattern should be ignored",
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
            description: "The tag \"class\" shouldn't cause problems",
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

          const files = [new WebManglerFileMock("html", input)];

          const cssClassMangler = new CssClassMangler({
            classNamePattern: classNamePattern || DEFAULT_PATTERN,
            reservedClassNames: reservedClassNames,
            keepClassNamePrefix: keepClassNamePrefix,
          });
          const options = cssClassMangler.options();
          const expressions = getExpressions(
            builtInLanguages,
            options.expressionOptions,
          );

          const result = mangleEngine(files, expressions, options);
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
            .map(({ before, after }): TestCase => ({
              input: `document.querySelectorAll("${before}");`,
              expected: `document.querySelectorAll("${after}");`,
            }))
            .flatMap((testCase) => varySpacing("\"", testCase))
            .flatMap((testCase) => varyQuotes("js", testCase)),
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
            .flatMap(({ before, after }): TestCase[] => [
              ...ATTRIBUTE_SELECTORS.map((attrSelector: string): TestCase => ({
                input: `querySelectorAll("${before}[${attrSelector}]");`,
                expected: `querySelectorAll("${after}[${attrSelector}]");`,
              })),
            ]),
        ],
      },
      {
        name: "query selector with or operator",
        cases: [
          ...SELECTOR_PAIRS
            .map(({ beforeA, beforeB, afterA, afterB }): TestCase => ({
              input: `document.querySelectorAll("${beforeA},${beforeB}");`,
              expected: `document.querySelectorAll("${afterA},${afterB}");`,
            }))
            .flatMap((testCase) => varySpacing(",", testCase)),
        ],
      },
      {
        name: "query selector with and operator",
        cases: [
          ...SELECTOR_PAIRS
            .map(({ beforeA, beforeB, afterA, afterB }): TestCase => ({
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
            .map(({ before, after }): TestCase => ({
              input: `document.querySelectorAll(":not(${before})");`,
              expected: `document.querySelectorAll(":not(${after})");`,
            }))
            .flatMap((testCase) => varySpacing(["(", ")"], testCase)),
          ...SELECTOR_PAIRS
            .map(({ beforeA, beforeB, afterA, afterB }): TestCase => ({
              input: `querySelectorAll("${beforeA}:not(${beforeB})");`,
              expected: `querySelectorAll("${afterA}:not(${afterB})");`,
            }))
            .flatMap((testCase) => varySpacing(["(", ")"], testCase)),
        ],
      },
      {
        name: "query selector with descendent combinator",
        cases: [
          ...SELECTOR_PAIRS.
            map(({ beforeA, beforeB, afterA, afterB }): TestCase => ({
              input: `document.querySelectorAll("${beforeA} ${beforeB}");`,
              expected: `document.querySelectorAll("${afterA} ${afterB}");`,
            })),
        ],
      },
      {
        name: "query selector with child combinator",
        cases: [
          ...SELECTOR_PAIRS
            .map(({ beforeA, beforeB, afterA, afterB }): TestCase => ({
              input: `document.querySelectorAll("${beforeA}>${beforeB}");`,
              expected: `document.querySelectorAll("${afterA}>${afterB}");`,
            }))
            .flatMap((testCase) => varySpacing(">", testCase)),
        ],
      },
      {
        name: "query selector with sibling combinator",
        cases: [
          ...SELECTOR_PAIRS
            .map(({ beforeA, beforeB, afterA, afterB }): TestCase => ({
              input: `document.querySelectorAll("${beforeA}+${beforeB}");`,
              expected: `document.querySelectorAll("${afterA}+${afterB}");`,
            }))
            .flatMap((testCase) => varySpacing("+", testCase)),
        ],
      },
      {
        name: "query selector with general sibling combinator",
        cases: [
          ...SELECTOR_PAIRS
            .map(({ beforeA, beforeB, afterA, afterB }): TestCase => ({
              input: `document.querySelectorAll("${beforeA}~${beforeB}");`,
              expected: `document.querySelectorAll("${afterA}~${afterB}");`,
            }))
            .flatMap((testCase) => varySpacing("~", testCase)),
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
            .flatMap((testCase) => varySpacing("\"", testCase))
            .flatMap((testCase) => varyQuotes("js", testCase)),
          ...["add", "toggle", "remove"]
            .map((method): TestCase => ({
              input: `var c = "cls-foobar"; $el.classList.${method}(c);`,
              expected: `var c = "a"; $el.classList.${method}(c);`,
            }))
            .flatMap((testCase) => varySpacing("\"", testCase))
            .flatMap((testCase) => varyQuotes("js", testCase)),
          ...["add", "remove"]
            .map((method): TestCase => ({
              input: `$el.classList.${method}("cls-foo", "cls-bar");`,
              expected: `$el.classList.${method}("a", "b");`,
            }))
            .flatMap((testCase) => varySpacing("\"", testCase))
            .flatMap((testCase) => varyQuotes("js", testCase)),
          ...["add", "toggle", "remove"]
            .map((method): TestCase => ({
              input: `$el.classList.${method}("foobar");`,
              expected: `$el.classList.${method}("foobar");`,
            }))
            .flatMap((testCase) => varySpacing("\"", testCase))
            .flatMap((testCase) => varyQuotes("js", testCase)),
        ],
      },
      {
        name: "edge cases",
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

          const files = [new WebManglerFileMock("js", input)];

          const cssClassMangler = new CssClassMangler({
            classNamePattern: classNamePattern || DEFAULT_PATTERN,
            reservedClassNames: reservedClassNames,
            keepClassNamePrefix: keepClassNamePrefix,
          });
          const options = cssClassMangler.options();
          const expressions = getExpressions(
            builtInLanguages,
            options.expressionOptions,
          );

          const result = mangleEngine(files, expressions, options);
          expect(result).to.have.length(1);

          const out = result[0];
          expect(out.content).to.equal(expected, failureMessage);
        }
      });
    }
  });

  suite("Configuration", function() {
    suite("::classNamePattern", function() {
      const DEFAULT_PATTERNS = ["cls-[a-zA-Z-_]+"];

      test("default patterns", function() {
        const cssClassMangler = new CssClassMangler();
        const result = cssClassMangler.options();
        expect(result).to.deep.include({ patterns: DEFAULT_PATTERNS });
      });

      test("one custom pattern", function() {
        const pattern = "foo(bar|baz)-[a-z]+";

        const cssClassMangler = new CssClassMangler({
          classNamePattern: pattern,
        });
        const result = cssClassMangler.options();
        expect(result).to.deep.include({ patterns: pattern });
      });

      test("multiple custom patterns", function() {
        const patterns: string[] = ["foobar-[a-z]+", "foobar-[0-9]+"];

        const cssClassMangler = new CssClassMangler({
          classNamePattern: patterns,
        });
        const result = cssClassMangler.options();
        expect(result).to.deep.include({ patterns: patterns });
      });
    });

    suite("::reservedClassNames", function() {
      test("default reserved", function() {
        const cssClassMangler = new CssClassMangler();
        const result = cssClassMangler.options();
        expect(result).to.have.property("reservedNames").that.is.not.empty;
      });

      test("custom reserved", function() {
        const reserved: string[] = ["foo", "bar"];

        const cssClassMangler = new CssClassMangler({
          reservedClassNames: reserved,
        });
        const result = cssClassMangler.options();
        expect(result).to.have.property("reservedNames");
        expect(result.reservedNames).to.include.members(reserved);
      });
    });

    suite("::keepClassNamePrefix", function() {
      const DEFAULT_MANGLE_PREFIX = "";

      test("default prefix", function() {
        const cssClassMangler = new CssClassMangler();
        const result = cssClassMangler.options();
        expect(result).to.deep.include({ manglePrefix: DEFAULT_MANGLE_PREFIX });
      });

      test("custom prefix", function() {
        const prefix = "foobar";

        const cssClassMangler = new CssClassMangler({
          keepClassNamePrefix: prefix,
        });
        const result = cssClassMangler.options();
        expect(result).to.deep.include({ manglePrefix: prefix });
      });
    });
  });

  suite("Illegal names", function() {
    const illegalNames: string[] = [
      ".-", ".0", ".1", ".2", ".3", ".4", ".5", ".6", ".7", ".8", ".9",
    ];

    let content = "";

    suiteSetup(function() {
      const n = ALL_CHARS.length;
      const nArray = getArrayOfFormattedStrings(n, ".cls-%s");
      content = `${nArray.join(",")} { }`;
    });

    test("without extra reserved", function() {
      const files = [new WebManglerFileMock("css", content)];

      const cssClassMangler = new CssClassMangler({
        classNamePattern: "cls-[0-9]+",
      });
      const options = cssClassMangler.options();
      const expressions = getExpressions(
        builtInLanguages,
        options.expressionOptions,
      );

      const result = mangleEngine(files, expressions, options);
      expect(result).to.have.lengthOf(1);

      const out = result[0];
      for (const illegalName of illegalNames) {
        expect(out.content).not.to.have.string(illegalName);
      }
    });

    test("with extra reserved", function() {
      const files = [new WebManglerFileMock("css", content)];

      const cssClassMangler = new CssClassMangler({
        classNamePattern: "cls-[0-9]+",
      });
      const options = cssClassMangler.options();
      const expressions = getExpressions(
        builtInLanguages,
        options.expressionOptions,
      );

      const result = mangleEngine(files, expressions, options);
      expect(result).to.have.lengthOf(1);

      const out = result[0];
      for (const illegalName of illegalNames) {
        expect(out.content).not.to.have.string(illegalName);
      }
    });
  });
});
