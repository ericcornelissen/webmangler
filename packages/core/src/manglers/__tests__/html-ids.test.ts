import type { TestScenario } from "@webmangler/testing";
import type { SingleValueAttributeOptions } from "../../languages/options";
import type { MangleOptions } from "../../types";
import type {
  SelectorBeforeAndAfter,
  SelectorPairBeforeAndAfter,
  TestCase,
} from "./types";

import { WebManglerFileMock } from "@webmangler/testing";
import { expect } from "chai";

import {
  ATTRIBUTE_SELECTOR_OPERATORS,
  ATTRIBUTE_SELECTORS,
  PSEUDO_ELEMENT_SELECTORS,
  PSEUDO_SELECTORS,
  SELECTOR_COMBINATORS,
} from "./css-constants";
import { SELF_CLOSING_TAGS, STANDARD_TAGS } from "./html-constants";
import { isValidIdName, varyQuotes, varySpacing } from "./test-helpers";

import mangleEngine from "../../engine";
import { getExpressions } from "../../index";
import BuiltInLanguageSupport from "../../languages/builtin";
import HtmlIdMangler from "../html-ids";

const builtInLanguages = [new BuiltInLanguageSupport()];

const DEFAULT_PATTERN = "id-[a-z]+";
const SELECTORS: SelectorBeforeAndAfter[] = [
  { before: ":root", after: ":root" },
  { before: "div", after: "div" },
  { before: "#foobar", after: "#foobar" },
  { before: ".foobar", after: ".foobar" },
  { before: "[data-foobar]", after: "[data-foobar]" },
  { before: "#id-foobar", after: "#a" },
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
  { beforeA: "div", beforeB: "#id-foo", afterA: "div", afterB: "#a" },
  { beforeA: "#id-foo", beforeB: "div", afterA: "#a", afterB: "div" },
  { beforeA: ".foo", beforeB: "#id-bar", afterA: ".foo", afterB: "#a" },
  { beforeA: "#id-foo", beforeB: ".bar", afterA: "#a", afterB: ".bar" },
  { beforeA: "#foo", beforeB: "#id-bar", afterA: "#foo", afterB: "#a" },
  { beforeA: "#id-foo", beforeB: "#bar", afterA: "#a", afterB: "#bar" },
  { beforeA: "#id-foo", beforeB: "#id-bar", afterA: "#a", afterB: "#b" },
  { beforeA: "#id-foobar", beforeB: "#id-foobar", afterA: "#a", afterB: "#a" },
];

suite("HTML ID Mangler", function() {
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
              .filter((combinator) => combinator !== "")
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
        name: "in attribute selectors",
        cases: [
          ...ATTRIBUTE_SELECTOR_OPERATORS
            .flatMap((operator: string): TestCase[] => [
              ...varySpacing(operator, {
                input: `[href${operator}"#id-foo"] { }`,
                expected: `[href${operator}"#a"] { }`,
              }),
            ])
            .flatMap((testCase) => varySpacing("\"", testCase))
            .flatMap((testCase) => varyQuotes("css", testCase)),
        ],
      },
      {
        name: "other selectors that match the pattern(s)",
        cases: [
          {
            input: "div { } #div { }",
            expected: "div { } #a { }",
            pattern: "[a-z]+",
          },
          {
            input: ".id-foo { } #id-foo { }",
            expected: ".id-foo { } #a { }",
          },
          ...PSEUDO_SELECTORS
            .filter(isValidIdName)
            .flatMap((pseudoSelector: string): TestCase[] => [
              {
                input: `input:${pseudoSelector} { } #${pseudoSelector} { }`,
                expected: `input:${pseudoSelector} { } #a { }`,
                pattern: "[a-zA-Z-]+",
              },
            ]),
          ...PSEUDO_ELEMENT_SELECTORS
            .filter(isValidIdName)
            .flatMap((pseudoElement: string): TestCase[] => [
              {
                input: `div::${pseudoElement} { } #${pseudoElement} { }`,
                expected: `div::${pseudoElement} { } #a { }`,
                pattern: "[a-zA-Z-]+",
              },
            ]),
          ...ATTRIBUTE_SELECTORS
            .filter(isValidIdName)
            .flatMap((attribute: string): TestCase[] => [
              {
                input: `div[${attribute}] { } #${attribute} { }`,
                expected: `div[${attribute}] { } #a { }`,
                pattern: "[a-zA-Z-]+",
              },
            ]),
        ],
      },
      {
        name: "strings that match the pattern",
        cases: [
          ...varySpacing("css", {
            input: "div { content: \"#id-foo\"; } #id-foo { }",
            expected: "div { content: \"#id-foo\"; } #a { }",
          }),
          ...varySpacing("css", {
            input: "div[data-foo=\"#id-foo\"] { } #id-foo { }",
            expected: "div[data-foo=\"#id-foo\"] { } #a { }",
          }),
        ],
      },
      {
        name: "edge cases",
        cases: [
          {
            input: "#id-foo",
            expected: "#a",
            description: "dangling id selectors should be mangled",
          },
          {
            input: "div{}#id-foo{}",
            expected: "div{}#a{}",
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
            pattern: idNamePattern,
            reserved: reservedIds,
            prefix: keepIdPrefix,
            description: failureMessage,
          } = testCase;

          const files = [new WebManglerFileMock("css", input)];

          const htmlIdMangler = new HtmlIdMangler({
            idNamePattern: idNamePattern || DEFAULT_PATTERN,
            reservedIds: reservedIds,
            keepIdPrefix: keepIdPrefix,
          });
          const options = htmlIdMangler.options();
          const expressions = getExpressions(
            builtInLanguages,
            options.languageOptions,
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
    const ATTR_SAMPLE: string[] = [
      "id=\"",
      "for=\"",
      "href=\"#",
      "href=\"/foo/bar#",
      "href=\"/foo/bar?hello=world#",
    ];

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
            ...varySpacing("=\"", {
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
        name: "unquoted ids",
        cases: [
          {
            input: "<div id=foobar></div>",
            expected: "<div id=a></div>",
            pattern: "[a-z]+",
          },
          {
            input: "<div id=foo class=\"bar\"></div>",
            expected: "<div id=a class=\"bar\"></div>",
            pattern: "[a-z]+",
          },
          ...varySpacing("/", {
            input: "<img id=foobar/>",
            expected: "<img id=a/>",
            pattern: "[a-z]+",
          }),
        ],
      },
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
        name: "ids in external URLs",
        cases: [
          {
            input: "<a href=\"http://www.example.com/foo#id-bar\"></a>",
            expected: "<a href=\"http://www.example.com/foo#id-bar\"></a>",
          },
          {
            input: "<a href=\"https://www.example.com/foo#id-bar\"></a>",
            expected: "<a href=\"https://www.example.com/foo#id-bar\"></a>",
          },
        ],
      },
      {
        name: "edge cases",
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
            .flatMap((attr): TestCase[] => [
              ...["data-", "x"]
                .map((prefix): TestCase => ({
                  input: `<div ${prefix}${attr}id-foo"></div>`,
                  expected: `<div ${prefix}${attr}id-foo"></div>`,
                  description: "Shouldn't mangle in attribute even if it ends in \"id\"",
                })),
            ]),
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

          const files = [new WebManglerFileMock("html", input)];

          const htmlIdMangler = new HtmlIdMangler({
            idNamePattern: idNamePattern || DEFAULT_PATTERN,
            reservedIds: reservedIds,
            keepIdPrefix: keepIdPrefix,
          });
          const options = htmlIdMangler.options();
          const expressions = getExpressions(
            builtInLanguages,
            options.languageOptions,
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
        name: "edge cases",
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

          const files = [new WebManglerFileMock("js", input)];

          const htmlIdMangler = new HtmlIdMangler({
            idNamePattern: idNamePattern || DEFAULT_PATTERN,
            reservedIds: reservedIds,
            keepIdPrefix: keepIdPrefix,
          });
          const options = htmlIdMangler.options();
          const expressions = getExpressions(
            builtInLanguages,
            options.languageOptions,
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
    suite("::idNamePatterns", function() {
      const DEFAULT_PATTERNS = ["id-[a-zA-Z-_]+"];

      test("default patterns", function() {
        const htmlIdMangler = new HtmlIdMangler();
        const result = htmlIdMangler.options();
        expect(result).to.deep.include({ patterns: DEFAULT_PATTERNS });
      });

      test("custom pattern", function() {
        const pattern = "foo(bar|baz)-[a-z]+";

        const htmlIdMangler = new HtmlIdMangler({ idNamePattern: pattern });
        const result = htmlIdMangler.options();
        expect(result).to.deep.include({ patterns: pattern });
      });

      test("custom patterns", function() {
        const patterns: string[] = ["foobar-[a-z]+", "foobar-[0-9]+"];

        const htmlIdMangler = new HtmlIdMangler({ idNamePattern: patterns });
        const result = htmlIdMangler.options();
        expect(result).to.deep.include({ patterns: patterns });
      });
    });

    suite("::reservedIds", function() {
      test("default reserved", function() {

        const htmlIdMangler = new HtmlIdMangler();
        const result = htmlIdMangler.options();
        expect(result).to.have.property("reservedNames").that.is.empty;
      });

      test("custom reserved", function() {
        const reserved: string[] = ["foo", "bar"];

        const htmlIdMangler = new HtmlIdMangler({ reservedIds: reserved });
        const result = htmlIdMangler.options();
        expect(result).to.deep.include({ reservedNames: reserved });
      });
    });

    suite("::keepIdPrefix", function() {
      const DEFAULT_MANGLE_PREFIX = "";

      test("default prefix", function() {
        const htmlIdMangler = new HtmlIdMangler();
        const result = htmlIdMangler.options();
        expect(result).to.deep.include({ manglePrefix: DEFAULT_MANGLE_PREFIX });
      });

      test("custom prefix", function() {
        const prefix = "foobar";

        const htmlIdMangler = new HtmlIdMangler({ keepIdPrefix: prefix });
        const result = htmlIdMangler.options();
        expect(result).to.deep.include({ manglePrefix: prefix });
      });
    });

    suite("::idAttributes", function() {
      const standardIdAttributes = ["id", "for"];

      const getLanguageOptions = (
        mangleOptions: MangleOptions,
      ): SingleValueAttributeOptions => {
        const allLanguageOptions = Array.from(mangleOptions.languageOptions);
        const languageOptions = allLanguageOptions[1];
        return languageOptions?.options as SingleValueAttributeOptions;
      };

      const cases: { idAttributes: string[], expected: string[] }[] = [
        {
          idAttributes: undefined as unknown as string[],
          expected: [...standardIdAttributes],
        },
        {
          idAttributes: [],
          expected: [...standardIdAttributes],
        },
        {
          idAttributes: ["foo", "bar"],
          expected: [...standardIdAttributes, "foo", "bar"],
        },
        {
          idAttributes: [...standardIdAttributes, "foo", "bar"],
          expected: [...standardIdAttributes, "foo", "bar"],
        },
      ];

      test("different configurations", function() {
        for (const testCase of cases) {
          const { expected, idAttributes } = testCase;
          const htmlIdMangler = new HtmlIdMangler({ idAttributes });
          const mangleOptions = htmlIdMangler.options();
          const options = getLanguageOptions(mangleOptions);
          expect(options).not.to.be.undefined;

          const attributeNames = options.attributeNames;
          expect(attributeNames).not.to.be.undefined;
          expect(attributeNames).to.include.keys(expected);

          const valuePrefix = options.valuePrefix;
          expect(valuePrefix).to.be.undefined;

          const valueSuffix = options.valueSuffix;
          expect(valueSuffix).to.be.undefined;
        }
      });
    });

    suite("::urlAttributes", function() {
      const standardUrlAttributes = ["href"];

      const getLanguageOptions = (
        mangleOptions: MangleOptions,
      ): SingleValueAttributeOptions => {
        const allLanguageOptions = Array.from(mangleOptions.languageOptions);
        const languageOptions = allLanguageOptions[2];
        return languageOptions?.options as SingleValueAttributeOptions;
      };

      const cases: { urlAttributes: string[], expected: string[] }[] = [
        {
          urlAttributes: undefined as unknown as string[],
          expected: [...standardUrlAttributes],
        },
        {
          urlAttributes: [],
          expected: [...standardUrlAttributes],
        },
        {
          urlAttributes: ["foo", "bar"],
          expected: [...standardUrlAttributes, "foo", "bar"],
        },
        {
          urlAttributes: [...standardUrlAttributes, "foo", "bar"],
          expected: [...standardUrlAttributes, "foo", "bar"],
        },
      ];

      test("different configurations", function() {
        for (const testCase of cases) {
          const { expected, urlAttributes } = testCase;
          const htmlIdMangler = new HtmlIdMangler({ urlAttributes });
          const mangleOptions = htmlIdMangler.options();
          const options = getLanguageOptions(mangleOptions);
          expect(options).not.to.be.undefined;

          const attributeNames = options.attributeNames;
          expect(attributeNames).not.to.be.undefined;
          expect(attributeNames).to.include.keys(expected);

          const valuePrefix = options.valuePrefix as string;
          expect(valuePrefix).not.to.be.undefined;
          expect(() => new RegExp(valuePrefix)).not.to.throw();

          const valueSuffix = options.valueSuffix as string;
          expect(valueSuffix).to.be.undefined;
        }
      });
    });
  });
});
