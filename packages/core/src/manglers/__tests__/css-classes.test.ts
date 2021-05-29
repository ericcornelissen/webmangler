import type { TestScenario } from "@webmangler/testing";
import type { MultiValueAttributeOptions } from "../../languages/options";
import type { MangleOptions } from "../../types";
import type {
  SelectorBeforeAndAfter,
  SelectorPairBeforeAndAfter,
  TestCase,
} from "./types";

import { WebManglerFileMock } from "@webmangler/testing";
import { expect } from "chai";

import {
  ATTRIBUTE_SELECTORS,
  PSEUDO_ELEMENT_SELECTORS,
  PSEUDO_SELECTORS,
  SELECTOR_COMBINATORS,
} from "./css-constants";
import { HTML_ATTRIBUTES } from "./html-constants";
import { UNCHANGING_ATTRIBUTES_TEST_SAMPLE } from "./html-fixtures";
import {
  embedAttributeValue,
  embedAttributesInAdjacentTags,
  embedAttributesInNestedTags,
  embedAttributesInTags,
  embedWithOtherAttributes,
} from "./html-helpers";
import {
  getArrayOfFormattedStrings,
  isValidClassName,
  varyCssQuotes,
  varyHtmlQuotes,
  varyJsQuotes,
  varySpacing,
} from "./test-helpers";

import { ALL_CHARS } from "../../characters";
import webmangler from "../../index";
import BuiltInLanguageSupport from "../../languages/builtin";
import CssClassMangler from "../css-classes";

const builtInLanguages = new BuiltInLanguageSupport();

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
          ...varyCssQuotes({
            input: "div { content: \".cls-foo\"; } .cls-foo { }",
            expected: "div { content: \".cls-foo\"; } .a { }",
          }),
          ...varyCssQuotes({
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

    run("css", scenarios);
  });

  suite("HTML - class attribute", function() {
    const embedClassesInAttribute = embedAttributeValue("class");

    const varyAttributeSpacing = varySpacing("=");
    const varyTagSpacing = varySpacing(["<", ">"]);

    const SAMPLE_CSS_CLASSES: TestCase[] = [
      {
        input: "cls-foobar",
        expected: "a",
      },
      {
        input: "cls-foo cls-bar",
        expected: "a b",
      },
      {
        input: "cls-foo bar",
        expected: "a bar",
      },
      {
        input: "foo cls-bar",
        expected: "foo a",
      },
      {
        input: "cls-praise cls-the cls-sun",
        expected: "a b c",
      },
      {
        input: "praise cls-the cls-sun",
        expected: "praise a b",
      },
      {
        input: "cls-praise the cls-sun",
        expected: "a the b",
      },
      {
        input: "cls-praise cls-the sun",
        expected: "a b sun",
      },
    ];

    const SAMPLE_CSS_CLASS_PAIRS: [TestCase, TestCase][] = [
      [
        {
          input: "class=\"cls-foo\"",
          expected: "class=\"a\"",
        },
        {
          input: "class=\"cls-bar\"",
          expected: "class=\"b\"",
        },
      ],
      [
        {
          input: "class=\"cls-foo\"",
          expected: "class=\"a\"",
        },
        {
          input: "class=\"bar\"",
          expected: "class=\"bar\"",
        },
      ],
      [
        {
          input: "class=\"foo\"",
          expected: "class=\"foo\"",
        },
        {
          input: "class=\"cls-bar\"",
          expected: "class=\"a\"",
        },
      ],
      [
        {
          input: "class=\"cls-foobar\"",
          expected: "class=\"a\"",
        },
        {
          input: "class=\"cls-foobar\"",
          expected: "class=\"a\"",
        },
      ],
      [
        {
          input: "class=\"cls-foo cls-bar\"",
          expected: "class=\"a b\"",
        },
        {
          input: "class=\"cls-foo\"",
          expected: "class=\"a\"",
        },
      ],
      [
        {
          input: "class=\"cls-foo cls-bar\"",
          expected: "class=\"b a\"",
        },
        {
          input: "class=\"cls-bar\"",
          expected: "class=\"a\"",
        },
      ],
    ];

    const scenarios: TestScenario<TestCase>[] = [
      {
        name: "no relevant content",
        cases: [
          {
            input: "class=\"foobar\"",
            expected: "class=\"foobar\"",
          },
          ...UNCHANGING_ATTRIBUTES_TEST_SAMPLE
            .filter((testCase) => !/(\s|^)(class)=/.test(testCase.input)),
        ]
        .flatMap(varyHtmlQuotes)
        .flatMap(embedAttributesInTags),
      },
      {
        name: "as only attribute",
        cases: SAMPLE_CSS_CLASSES
          .map(embedClassesInAttribute)
          .flatMap(varyAttributeSpacing)
          .flatMap(varyHtmlQuotes)
          .flatMap(embedAttributesInTags),
      },
      {
        name: "unquoted class values",
        cases: [
          {
            input: "cls-foo",
            expected: "a",
          },
          {
            input: "cls-bar",
            expected: "a",
          },
        ]
        .map(embedClassesInAttribute)
        .map((testCase: TestCase): TestCase => ({
          input: testCase.input.replace(/"/g, ""),
          expected: testCase.expected.replace(/"/g, ""),
        }))
        .flatMap(varyAttributeSpacing)
        .flatMap(embedAttributesInTags),
      },
      {
        name: "with other attributes",
        cases: SAMPLE_CSS_CLASSES
          .map(embedClassesInAttribute)
          .flatMap(embedWithOtherAttributes)
          .flatMap(embedAttributesInTags),
      },
      {
        name: "on adjacent elements",
        cases: SAMPLE_CSS_CLASS_PAIRS.flatMap(embedAttributesInAdjacentTags),
      },
      {
        name: "on nested elements",
        cases: SAMPLE_CSS_CLASS_PAIRS.flatMap(embedAttributesInNestedTags),
      },
      {
        name: "valueless class attributes",
        cases: [
          {
            input: "class",
            expected: "class",
          },
          {
            input: "class=\"\"",
            expected: "class=\"\"",
          },
        ]
        .flatMap(varyAttributeSpacing)
        .flatMap(varyHtmlQuotes)
        .flatMap(embedWithOtherAttributes)
        .flatMap(embedAttributesInTags),
      },
      {
        name: "class-like strings as HTML content",
        cases: [
          {
            input: "<p>cls-foobar</p>",
            expected: "<p>cls-foobar</p>",
          },
          {
            input: "<p class=\"cls-foo\">cls-bar</p>",
            expected: "<p class=\"a\">cls-bar</p>",
          },
          {
            input: "<p class=\"cls-foobar\">cls-foobar</p>",
            expected: "<p class=\"a\">cls-foobar</p>",
          },
          {
            input: "<p>.cls-foobar</p>",
            expected: "<p>.cls-foobar</p>",
          },
          {
            input: "<p class=\"cls-foo\">.cls-bar</p>",
            expected: "<p class=\"a\">.cls-bar</p>",
          },
          {
            input: "<p class=\"cls-foobar\">.cls-foobar</p>",
            expected: "<p class=\"a\">.cls-foobar</p>",
          },
          {
            input: "<p>class=\"cls-foobar\"</p>",
            expected: "<p>class=\"cls-foobar\"</p>",
          },
          {
            input: "<p class=\"cls-foo\">class=\"cls-bar\"</p>",
            expected: "<p class=\"a\">class=\"cls-bar\"</p>",
          },
          {
            input: "<p class=\"cls-foobar\">class=\"cls-foobar\"</p>",
            expected: "<p class=\"a\">class=\"cls-foobar\"</p>",
          },
        ].flatMap(varyTagSpacing),
      },
      {
        name: "class-like strings in non-class attributes",
        cases: [
          ...HTML_ATTRIBUTES
            .filter((attribute: string) => !/^(class)$/.test(attribute))
            .flatMap((attribute: string): TestCase[] => [
              {
                input: `${attribute}="cls-foobar"`,
                expected: `${attribute}="cls-foobar"`,
              },
              {
                input: `class="cls-foo" ${attribute}="cls-bar"`,
                expected: `class="a" ${attribute}="cls-bar"`,
              },
              {
                input: `class="cls-foobar" ${attribute}="cls-foobar"`,
                expected: `class="a" ${attribute}="cls-foobar"`,
              },
              {
                input: `${attribute}="cls-foo bar"`,
                expected: `${attribute}="cls-foo bar"`,
              },
              {
                input: `class="cls-praise" ${attribute}="cls-the sun"`,
                expected: `class="a" ${attribute}="cls-the sun"`,
              },
              {
                input: `class="cls-foo" ${attribute}="cls-foo bar"`,
                expected: `class="a" ${attribute}="cls-foo bar"`,
              },
              {
                input: `${attribute}="foo cls-bar"`,
                expected: `${attribute}="foo cls-bar"`,
              },
              {
                input: `class="cls-praise" ${attribute}="the cls-sun"`,
                expected: `class="a" ${attribute}="the cls-sun"`,
              },
              {
                input: `class="cls-bar" ${attribute}="foo cls-bar"`,
                expected: `class="a" ${attribute}="foo cls-bar"`,
              },
              {
                input: `${attribute}="praise cls-the sun"`,
                expected: `${attribute}="praise cls-the sun"`,
              },
              {
                input: `class="cls-hello" ${attribute}="world cls-foo bar"`,
                expected: `class="a" ${attribute}="world cls-foo bar"`,
              },
              {
                input: `class="cls-the" ${attribute}="praise cls-the sun"`,
                expected: `class="a" ${attribute}="praise cls-the sun"`,
              },
            ]),
          ...["x", "data-"]
            .flatMap((prefix: string): TestCase[] => [
              {
                input: `${prefix}class="cls-foobar"`,
                expected: `${prefix}class="cls-foobar"`,
              },
              {
                input: `class="cls-foo" ${prefix}class="cls-bar"`,
                expected: `class="a" ${prefix}class="cls-bar"`,
              },
              {
                input: `class="cls-foobar" ${prefix}class="cls-foobar"`,
                expected: `class="a" ${prefix}class="cls-foobar"`,
              },
            ]),
          ...["x", "-data"]
            .flatMap((suffix: string): TestCase[] => [
              {
                input: `class${suffix}="cls-foobar"`,
                expected: `class${suffix}="cls-foobar"`,
              },
              {
                input: `class="cls-foo" class${suffix}="cls-bar"`,
                expected: `class="a" class${suffix}="cls-bar"`,
              },
              {
                input: `class="cls-foobar" class${suffix}="cls-foobar"`,
                expected: `class="a" class${suffix}="cls-foobar"`,
              },
            ]),
        ].flatMap(embedAttributesInTags),
      },
      {
        name: "non-closing \">\"",
        cases: [
          {
            input: "id=\">\" class=\"cls-foobar\"",
            expected: "id=\">\" class=\"a\"",
          },
          {
            input: "class=\"cls-foobar\" id=\">\"",
            expected: "class=\"a\" id=\">\"",
          },
          {
            input: "class=\"cls-foo\" id=\">\" class=\"cls-bar\"",
            expected: "class=\"a\" id=\">\" class=\"b\"",
          },
          {
            input: "class=\"> cls-foobar\"",
            expected: "class=\"> a\"",
          },
          {
            input: "class=\"cls-foobar >\"",
            expected: "class=\"a >\"",
          },
          {
            input: "class=\"cls-foo > cls-bar\"",
            expected: "class=\"a > b\"",
          },
        ].flatMap(embedAttributesInTags),
      },
      {
        name: "attribute repetition",
        cases: [
          {
            input: "class=\"cls-foo\" class=\"cls-bar\"",
            expected: "class=\"a\" class=\"b\"",
          },
          {
            input: "class=\"cls-foobar\" class=\"cls-foobar\"",
            expected: "class=\"a\" class=\"a\"",
          },
        ].flatMap(embedAttributesInTags),
      },
      {
        name: "in-attribute value repetition",
        cases: [
          {
            input: "cls-foobar cls-foobar",
            expected: "a a",
          },
          {
            input: "cls-foo cls-bar cls-foo",
            expected: "a b a",
          },
        ]
        .map(embedClassesInAttribute)
        .flatMap(embedAttributesInTags),
      },
      {
        name: "\"class\" as tag",
        cases: [
          {
            input: "<class id=\"foobar\"></class>",
            expected: "<class id=\"foobar\"></class>",
          },
          ...varySpacing("/", {
            input: "<class id=\"foobar\"/>",
            expected: "<class id=\"foobar\"/>",
          }),
          {
            input: "<class class=\"cls-foobar\"></class>",
            expected: "<class class=\"a\"></class>",
          },
          ...varySpacing("/", {
            input: "<class class=\"cls-foobar\"/>",
            expected: "<class class=\"a\"/>",
          }),
        ],
      },
    ];

    run("html", scenarios);
  });

  suite("JavaScript", function() {
    const varyQuoteSpacing = varySpacing("\"");
    const varyCommaSpacing = varySpacing(",");
    const varyParenthesisSpacing = varySpacing(["(", ")"]);
    const varyCombinatorSpacing = varySpacing([">", "~", "+"]);

    const scenarios: TestScenario<TestCase>[] = [
      {
        name: "query selectors with one selector",
        cases: [
          ...SELECTORS
            .map(({ before, after }): TestCase => ({
              input: `document.querySelectorAll("${before}");`,
              expected: `document.querySelectorAll("${after}");`,
            }))
            .flatMap(varyQuoteSpacing)
            .flatMap(varyJsQuotes),
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
          ...varyJsQuotes({
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
            .flatMap(varyCommaSpacing),
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
            .flatMap(varyParenthesisSpacing),
          ...SELECTOR_PAIRS
            .map(({ beforeA, beforeB, afterA, afterB }): TestCase => ({
              input: `querySelectorAll("${beforeA}:not(${beforeB})");`,
              expected: `querySelectorAll("${afterA}:not(${afterB})");`,
            }))
            .flatMap(varyParenthesisSpacing),
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
            .flatMap(varyCombinatorSpacing),
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
            .flatMap(varyCombinatorSpacing),
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
            .flatMap(varyCombinatorSpacing),
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
            .flatMap(varyQuoteSpacing)
            .flatMap(varyJsQuotes),
          ...["add", "toggle", "remove"]
            .map((method): TestCase => ({
              input: `var c = "cls-foobar"; $el.classList.${method}(c);`,
              expected: `var c = "a"; $el.classList.${method}(c);`,
            }))
            .flatMap(varyQuoteSpacing)
            .flatMap(varyJsQuotes),
          ...["add", "remove"]
            .map((method): TestCase => ({
              input: `$el.classList.${method}("cls-foo", "cls-bar");`,
              expected: `$el.classList.${method}("a", "b");`,
            }))
            .flatMap(varyQuoteSpacing)
            .flatMap(varyJsQuotes),
          ...["add", "toggle", "remove"]
            .map((method): TestCase => ({
              input: `$el.classList.${method}("foobar");`,
              expected: `$el.classList.${method}("foobar");`,
            }))
            .flatMap(varyQuoteSpacing)
            .flatMap(varyJsQuotes),
        ],
      },
      {
        name: "edge cases",
        cases: [
          ...varyJsQuotes({
            input: "var cls_foo = \"cls-foo\";",
            expected: "var cls_foo = \"a\";",
            pattern: "[a-z-_]+",
            description: `
              Anything outside quotation marks matching the pattern should be
              ignored.
            `,
          }),
          ...varyJsQuotes({
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

    run("js", scenarios);
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

        const reservedNames = Array.from(result.reservedNames as string[]);
        expect(reservedNames).to.include.members(reserved);
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

    suite("::classAttributes", function() {
      const standardClassAttributes = ["class"];

      const getLanguageOptions = (
        mangleOptions: MangleOptions,
      ): MultiValueAttributeOptions => {
        const allLanguageOptions = Array.from(mangleOptions.languageOptions);
        const languageOptions = allLanguageOptions[1];
        return languageOptions?.options as MultiValueAttributeOptions;
      };

      const cases: { classAttributes: string[], expected: string[] }[] = [
        {
          classAttributes: undefined as unknown as string[],
          expected: [...standardClassAttributes],
        },
        {
          classAttributes: [],
          expected: [...standardClassAttributes],
        },
        {
          classAttributes: ["foo", "bar"],
          expected: [...standardClassAttributes, "foo", "bar"],
        },
        {
          classAttributes: [...standardClassAttributes, "foo", "bar"],
          expected: [...standardClassAttributes, "foo", "bar"],
        },
      ];

      test("different configurations", function() {
        for (const testCase of cases) {
          const { expected, classAttributes } = testCase;
          const cssClassMangler = new CssClassMangler({ classAttributes });
          const mangleOptions = cssClassMangler.options();
          const options = getLanguageOptions(mangleOptions);
          expect(options).not.to.be.undefined;

          const attributeNames = Array.from(options.attributeNames);
          expect(attributeNames).not.to.be.undefined;
          expect(attributeNames).to.include.members(expected);
        }
      });
    });
  });

  suite("Illegal names", function() {
    const illegalNames: string[] = [
      ".-", ".0", ".1", ".2", ".3", ".4", ".5", ".6", ".7", ".8", ".9",
    ];

    let content = "";

    suiteSetup(function() {
      const n = Array.from(ALL_CHARS).length;
      const nArray = getArrayOfFormattedStrings(n, ".cls-%s");
      content = `${nArray.join(",")} { }`;
    });

    test("without extra reserved", function() {
      const files = [new WebManglerFileMock("css", content)];

      const cssClassMangler = new CssClassMangler({
        classNamePattern: "cls-[0-9]+",
      });

      const result = webmangler(files, {
        plugins: [cssClassMangler],
        languages: [builtInLanguages],
      });
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

      const result = webmangler(files, {
        plugins: [cssClassMangler],
        languages: [builtInLanguages],
      });
      expect(result).to.have.lengthOf(1);

      const out = result[0];
      for (const illegalName of illegalNames) {
        expect(out.content).not.to.have.string(illegalName);
      }
    });
  });
});

/**
 * Run an integration test.
 *
 * @param language The language being tested.
 * @param scenarios The {@link TestScenario}s.
 */
function run(language: string, scenarios: TestScenario<TestCase>[]): void {
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

        const files = [new WebManglerFileMock(language, input)];

        const cssClassMangler = new CssClassMangler({
          classNamePattern: classNamePattern || DEFAULT_PATTERN,
          reservedClassNames: reservedClassNames,
          keepClassNamePrefix: keepClassNamePrefix,
        });

        const result = webmangler(files, {
          plugins: [cssClassMangler],
          languages: [builtInLanguages],
        });
        expect(result).to.have.length(1);

        const out = result[0];
        expect(out.content).to.equal(expected, failureMessage);
      }
    });
  }
}
