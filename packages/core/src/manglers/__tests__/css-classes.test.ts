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
import {
  embedAttributesInTags,
  SELF_CLOSING_TAGS,
  STANDARD_TAGS,
} from "./html-helpers";
import {
  getArrayOfFormattedStrings,
  isValidClassName,
  varyQuotes,
  varySpacing,
} from "./test-helpers";

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
    ];

    const embedClassesInAttribute = (testCase: TestCase): TestCase => {
      return {
        input: `class="${testCase.input}"`,
        expected: `class="${testCase.expected}"`,
      };
    };

    const scenarios: TestScenario<TestCase>[] = [
      {
        name: "no CSS classes",
        cases: [
          {
            input: "alt=\"Lorem ipsum dolor\"",
            expected: "alt=\"Lorem ipsum dolor\"",
          },
          {
            input: "data-foo=\"bar\"",
            expected: "data-foo=\"bar\"",
          },
          {
            input: "height=\"36\" width=\"42\"",
            expected: "height=\"36\" width=\"42\"",
          },
        ].flatMap(embedAttributesInTags),
      },
      {
        name: "varying spacing in attributes",
        cases: SAMPLE_CSS_CLASSES
          .flatMap(embedClassesInAttribute)
          .flatMap((testCase) => varySpacing(["=", "\""], testCase))
          .flatMap(embedAttributesInTags),
      },
      {
        name: "varying quotes",
        cases: SAMPLE_CSS_CLASSES
          .flatMap(embedClassesInAttribute)
          .flatMap((testCase) => varyQuotes("html", testCase))
          .flatMap(embedAttributesInTags),
      },
      {
        name: "with other attributes",
        cases: SAMPLE_CSS_CLASSES
          .flatMap((testCase: TestCase): TestCase[] => [
            {
              input: `class="${testCase.input}"`,
              expected: `class="${testCase.expected}"`,
            },
            {
              input: `id="foobar" class="${testCase.input}"`,
              expected: `id="foobar" class="${testCase.expected}"`,
            },
            {
              input: `disabled class="${testCase.input}"`,
              expected: `disabled class="${testCase.expected}"`,
            },
            {
              input: `class="${testCase.input}" width="42"`,
              expected: `class="${testCase.expected}" width="42"`,
            },
            {
              input: `class="${testCase.input}" aria-hidden`,
              expected: `class="${testCase.expected}" aria-hidden`,
            },
            {
              input: `id="foobar" class="${testCase.input}" width="42"`,
              expected: `id="foobar" class="${testCase.expected}" width="42"`,
            },
            {
              input: `disabled class="${testCase.input}" aria-hidden`,
              expected: `disabled class="${testCase.expected}" aria-hidden`,
            },
            {
              input: `disabled class="${testCase.input}" width="42"`,
              expected: `disabled class="${testCase.expected}" width="42"`,
            },
            {
              input: `id="foobar" class="${testCase.input}" aria-hidden`,
              expected: `id="foobar" class="${testCase.expected}" aria-hidden`,
            },
          ])
          .flatMap(embedAttributesInTags),
      },
      {
        name: "classes in multiple attributes",
        cases: [
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
        ].flatMap(([testCaseA, testCaseB]): TestCase[] =>
          STANDARD_TAGS.flatMap((tag1: string): TestCase[] => [
            ...STANDARD_TAGS
              .flatMap((tag2: string): TestCase[] => [
                {
                  input: `
                    <${tag1} ${testCaseA.input}>Hello</${tag1}>
                    <${tag2} ${testCaseB.input}>World!</${tag2}>
                  `,
                  expected: `
                    <${tag1} ${testCaseA.expected}>Hello</${tag1}>
                    <${tag2} ${testCaseB.expected}>World!</${tag2}>
                  `,
                },
                {
                  input: `
                    <${tag1} ${testCaseA.input}>
                      <${tag2} ${testCaseB.input}></${tag2}>
                    </${tag1}>
                  `,
                  expected: `
                    <${tag1} ${testCaseA.expected}>
                      <${tag2} ${testCaseB.expected}></${tag2}>
                    </${tag1}>
                  `,
                },
              ]),
            ...SELF_CLOSING_TAGS
              .flatMap((tag2: string): TestCase[] => [
                {
                  input: `
                    <${tag1} ${testCaseA.input}></${tag1}>
                    <${tag2} ${testCaseB.input}/>
                  `,
                  expected: `
                    <${tag1} ${testCaseA.expected}></${tag1}>
                    <${tag2} ${testCaseB.expected}/>
                  `,
                },
                {
                  input: `
                    <${tag2} ${testCaseA.input}/>
                    <${tag1} ${testCaseB.input}></${tag1}>
                  `,
                  expected: `
                    <${tag2} ${testCaseA.expected}/>
                    <${tag1} ${testCaseB.expected}></${tag1}>
                  `,
                },
                {
                  input: `
                    <${tag1} ${testCaseA.input}>
                      <${tag2} ${testCaseB.input}/>
                    </${tag1}>
                  `,
                  expected: `
                    <${tag1} ${testCaseA.expected}>
                      <${tag2} ${testCaseB.expected}/>
                    </${tag1}>
                  `,
                },
              ]),
        ])),
      },
      {
        name: "class-like strings in non-class places",
        cases: [
          {
            input: "<p>cls-foo</p>",
            expected: "<p>cls-foo</p>",
            description: "anything inside tags should be ignored",
          },
          {
            input: "<div id=\"cls-foo\" class=\"cls-foo\"></div>",
            expected: "<div id=\"cls-foo\" class=\"a\"></div>",
          },
          {
            input: "<p>.cls-foo</p>",
            expected: "<p>.cls-foo</p>",
            description: "anything inside tags should be ignored",
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
            .map((prefix: string): TestCase => ({
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

          const attributeNames = options.attributeNames;
          expect(attributeNames).not.to.be.undefined;
          expect(attributeNames).to.include.keys(expected);
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
      const options = cssClassMangler.options();
      const expressions = getExpressions(
        builtInLanguages,
        options.languageOptions,
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
        options.languageOptions,
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
