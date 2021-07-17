import type { TestScenario } from "@webmangler/testing";
import type { SingleValueAttributeOptions } from "../../languages/options";
import type { MangleOptions } from "../../types";
import type {
  SelectorBeforeAndAfter,
  SelectorPairBeforeAndAfter,
  TestCase,
} from "./types";

import { expect } from "chai";
import * as _ from "lodash";

import {
  ATTRIBUTE_SELECTOR_OPERATORS,
  ATTRIBUTE_SELECTORS,
  PSEUDO_ELEMENT_SELECTORS,
  PSEUDO_SELECTORS,
  SELECTOR_COMBINATORS,
} from "./css-constants";
import { HTML_ATTRIBUTES } from "./html-constants";
import { UNCHANGING_ATTRIBUTES_TEST_SAMPLE } from "./html-fixtures";
import {
  embedAttributesInAdjacentTags,
  embedAttributesInNestedTags,
  embedAttributesInTags,
  embedWithOtherAttributes,
} from "./html-helpers";
import {
  isValidIdName,
  varyCssQuotes,
  varyHtmlQuotes,
  varyJsQuotes,
  varySpacing,
} from "./test-helpers";

import webmangler from "../../index";
import BuiltInLanguageSupport from "../../languages/builtin";
import HtmlIdMangler from "../html-ids";

const builtInLanguages = new BuiltInLanguageSupport();

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
    const varyQuoteSpacing = varySpacing("\"");

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
            .flatMap(varyQuoteSpacing)
            .flatMap(varyCssQuotes),
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
          ...varyCssQuotes({
            input: "div { content: \"#id-foo\"; } #id-foo { }",
            expected: "div { content: \"#id-foo\"; } #a { }",
          }),
          ...varyCssQuotes({
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

    run("css", scenarios);
  });

  suite("HTML - attributes", function() {
    const ID_ATTRIBUTES: string[] = ["id", "for"];
    const HREF_ATTRIBUTES: string[] = ["href"];
    const ATTRIBUTES: string[] = [
      ...ID_ATTRIBUTES,
      ...HREF_ATTRIBUTES,
    ];

    const varyAttributeSpacing = (testCase: TestCase): TestCase[] => {
      return varySpacing("=", testCase)
        .map(({ input, expected }: TestCase): TestCase => ({
          input: input.replace(/\?([a-z]+)\s*=\s*([a-z]+)/g, "?$1=$2"),
          expected: expected.replace(/\?([a-z]+)\s*=\s*([a-z]+)/g, "?$1=$2"),
        }));
    };
    const varyTagSpacing = varySpacing(["<", ">"]);

    type TestInstance = {
      readonly name: string;
      factory(idBefore: string, idAfter: string): TestCase[];
    }

    const instances: TestInstance[] = [
      {
        name: "id attribute",
        factory: (idBefore: string, idAfter: string): TestCase[] => [
          {
            input: `id="${idBefore}"`,
            expected: `id="${idAfter}"`,
          },
        ],
      },
      {
        name: "for attribute",
        factory: (idBefore: string, idAfter: string): TestCase[] => [
          {
            input: `for="${idBefore}"`,
            expected: `for="${idAfter}"`,
          },
        ],
      },
      {
        name: "href attribute",
        factory: (idBefore: string, idAfter: string): TestCase[] => [
          {
            input: `href="#${idBefore}"`,
            expected: `href="#${idAfter}"`,
          },
          {
            input: `href="/foo/bar#${idBefore}"`,
            expected: `href="/foo/bar#${idAfter}"`,
          },
          {
            input: `href="/foo/bar?hello=world#${idBefore}"`,
            expected: `href="/foo/bar?hello=world#${idAfter}"`,
          },
        ],
      },
    ];

    const scenarios: TestScenario<TestCase>[] = [
      {
        name: "no relevant content",
        cases: UNCHANGING_ATTRIBUTES_TEST_SAMPLE
          .filter((testCase) => !/(\s|^)(id|for|href)=/.test(testCase.input))
          .flatMap(varyHtmlQuotes)
          .flatMap(embedAttributesInTags),
      },
      {
        name: "valueless id attributes",
        cases: ATTRIBUTES
          .flatMap((attribute: string): TestCase[] => [
            {
              input: attribute,
              expected: attribute,
            },
            {
              input: `${attribute}=""`,
              expected: `${attribute}=""`,
            },
          ])
          .flatMap(varyAttributeSpacing)
          .flatMap(varyHtmlQuotes)
          .flatMap(embedWithOtherAttributes)
          .flatMap(embedAttributesInTags),
      },
      {
        name: "id-like strings in HTML content",
        cases: [
          {
            input: "<div>id-foobar</div>",
            expected: "<div>id-foobar</div>",
          },
          {
            input: "<div>#id-foobar</div>",
            expected: "<div>#id-foobar</div>",
          },
        ].flatMap(varyTagSpacing),
      },
      {
        name: "id-like strings in non-id attributes",
        cases: HTML_ATTRIBUTES
          .filter((attribute: string) => !/^(id|for|href)$/.test(attribute))
          .flatMap((attribute: string): TestCase[] => [
            {
              input: `${attribute}="id-foobar"`,
              expected: `${attribute}="id-foobar"`,
            },
            {
              input: `${attribute}="#id-foobar"`,
              expected: `${attribute}="#id-foobar"`,
            },
          ])
          .flatMap(embedAttributesInTags),
      },
      {
        name: "ids in external URLs",
        cases: HREF_ATTRIBUTES
          .flatMap((attribute: string): TestCase[] => [
            {
              input: `<a ${attribute}="http://www.example.com/foo#id-bar"></a>`,
              expected: `<a ${attribute}="http://www.example.com/foo#id-bar"></a>`,
              description: "ignore ids in external \"http\" URLs",
            },
            {
              input: `<a ${attribute}="https://www.example.com/foo#id-bar"></a>`,
              expected: `<a ${attribute}="https://www.example.com/foo#id-bar"></a>`,
              description: "ignore ids in external \"https\" URLs",
            },
          ]),
      },
    ];

    for (const instance of instances) {
      const { name, factory } = instance;

      const ATTRIBUTE_VALUE_PAIRS: [TestCase, TestCase][] = [
        [factory("id-foo", "a"), factory("id-bar", "b")],
        [factory("id-foobar", "a"), factory("id-foobar", "a")],
      ].flatMap(([testCasesA, testCasesB]): [TestCase, TestCase][] => {
        return _.zip(testCasesA, testCasesB) as [TestCase, TestCase][];
      });

      scenarios.push(...[
        {
          name: `no matching ${name} value`,
          cases: factory("foobar", "foobar")
            .flatMap(varyHtmlQuotes)
            .flatMap(embedAttributesInTags),
        },
        {
          name: `${name} as only attribute`,
          cases: factory("id-foo", "a")
            .flatMap(varyAttributeSpacing)
            .flatMap(varyHtmlQuotes)
            .flatMap(embedAttributesInTags),
        },
        {
          name: `${name} with unquoted value`,
          cases: factory("id-foobar", "a")
            .map((testCase: TestCase): TestCase => ({
              input: testCase.input.replace(/"/g, ""),
              expected: testCase.expected.replace(/"/g, ""),
            }))
            .flatMap(varyAttributeSpacing)
            .flatMap(embedAttributesInTags),
        },
        {
          name: `${name} with other attributes`,
          cases: factory("id-foo", "a")
            .flatMap(embedWithOtherAttributes)
            .flatMap(embedAttributesInTags),
        },
        {
          name: `${name} on adjacent elements`,
          cases: ATTRIBUTE_VALUE_PAIRS
            .flatMap(embedAttributesInAdjacentTags),
        },
        {
          name: `${name} on nested elements`,
          cases: ATTRIBUTE_VALUE_PAIRS
            .flatMap(embedAttributesInNestedTags),
        },
        {
          name: `${name} with id in HTML content`,
          cases: factory("id-foo", "a")
            .flatMap((testCase: TestCase): TestCase[] => [
              {
                input: `<div ${testCase.input}>id-bar</div>`,
                expected: `<div ${testCase.expected}>id-bar</div>`,
              },
              {
                input: `<div ${testCase.input}>id-foo</div>`,
                expected: `<div ${testCase.expected}>id-foo</div>`,
              },
              {
                input: `<div ${testCase.input}>#id-bar</div>`,
                expected: `<div ${testCase.expected}>#id-bar</div>`,
              },
              {
                input: `<div ${testCase.input}>#id-foo</div>`,
                expected: `<div ${testCase.expected}>#id-foo</div>`,
              },
              {
                input: `<div>${testCase.input}</div>`,
                expected: `<div>${testCase.input}</div>`,
              },
              {
                input: `<div ${testCase.input}>${testCase.input}</div>`,
                expected: `<div ${testCase.expected}>${testCase.input}</div>`,
              },
            ])
            .flatMap(varyTagSpacing),
        },
        {
          name: `${name} with id in non-id tag`,
          cases: factory("id-foo", "a")
            .flatMap((testCase: TestCase): TestCase[] => [
              {
                input: `${testCase.input} alt="id-bar"`,
                expected: `${testCase.expected} alt="id-bar"`,
              },
              {
                input: `${testCase.input} alt="id-foo"`,
                expected: `${testCase.expected} alt="id-foo"`,
              },
              {
                input: `${testCase.input} alt="#id-bar"`,
                expected: `${testCase.expected} alt="#id-bar"`,
              },
              {
                input: `${testCase.input} alt="#id-foo"`,
                expected: `${testCase.expected} alt="#id-foo"`,
              },
              ...["x", "data-"]
                .flatMap((prefix: string): TestCase[] => [
                  {
                    input: `${prefix}${testCase.input}`,
                    expected: `${prefix}${testCase.input}`,
                  },
                  {
                    input: `
                      ${testCase.input} ${prefix}${testCase.input}"
                    `,
                    expected: `
                      ${testCase.expected} ${prefix}${testCase.input}"
                    `,
                  },
                ]),
            ])
            .flatMap(embedAttributesInTags),
        },
        {
          name: `${name} with non-closing ">"`,
          cases: factory("id-foobar", "a")
            .flatMap((testCase: TestCase): TestCase[] => [
              {
                input: `alt=">" ${testCase.input}`,
                expected: `alt=">" ${testCase.expected}`,
              },
              {
                input: `${testCase.input} alt=">"`,
                expected: `${testCase.expected} alt=">"`,
              },
            ])
            .flatMap(embedAttributesInTags),
        },
        {
          name: `${name} attribute repetition`,
          cases: [
            ...ATTRIBUTE_VALUE_PAIRS
              .map(([testCaseA, testCaseB]): TestCase => ({
                input: `${testCaseA.input} ${testCaseB.input}`,
                expected: `${testCaseA.expected} ${testCaseB.expected}`,
              })),
            ...factory("id-foobar", "a")
              .map((testCase: TestCase): TestCase => ({
                input: `${testCase.input} ${testCase.input}`,
                expected: `${testCase.expected} ${testCase.expected}`,
              })),
          ].flatMap(embedAttributesInTags),
        },
        {
          name: `${name} with id-related attribute names as tags`,
          cases: factory("id-foobar", "a")
            .flatMap((testCase: TestCase): TestCase[] => [
              ...ATTRIBUTES
                .flatMap((attr: string): TestCase[] => [
                  {
                    input: `<${attr} class="foobar"></${attr}>`,
                    expected: `<${attr} class="foobar"></${attr}>`,
                  },
                  {
                    input: `<${attr} class="foobar"/>`,
                    expected: `<${attr} class="foobar"/>`,
                  },
                  {
                    input: `<${attr} ${testCase.input}></${attr}>`,
                    expected: `<${attr} ${testCase.expected}></${attr}>`,
                  },
                  {
                    input: `<${attr} ${testCase.input}/>`,
                    expected: `<${attr} ${testCase.expected}/>`,
                  },
                ]),
            ]),
        },
      ]);
    }

    run("html", scenarios);
  });

  suite("JavaScript", function() {
    const scenarios: TestScenario<TestCase>[] = [
      {
        name: "id query selector",
        cases: [
          ...varyJsQuotes({
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
          ...varyJsQuotes({
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

    run("js", scenarios);
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

    suite("::ignoreIdNamePattern", function() {
      const DEFAULT_PATTERNS: string[] = [];

      test("default patterns", function() {
        const htmlIdMangler = new HtmlIdMangler();
        const result = htmlIdMangler.options();
        expect(result).to.deep.include({ ignorePatterns: DEFAULT_PATTERNS });
      });

      test("one custom pattern", function() {
        const ignorePatterns = "foo(bar|baz)-[a-z]+";

        const htmlIdMangler = new HtmlIdMangler({
          ignoreIdNamePattern: ignorePatterns,
        });
        const result = htmlIdMangler.options();
        expect(result).to.deep.include({ ignorePatterns: ignorePatterns });
      });

      test("multiple custom patterns", function() {
        const ignorePatterns: string[] = ["foobar-[a-z]+", "foobar-[0-9]+"];

        const htmlIdMangler = new HtmlIdMangler({
          ignoreIdNamePattern: ignorePatterns,
        });
        const result = htmlIdMangler.options();
        expect(result).to.deep.include({ ignorePatterns: ignorePatterns });
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

          const attributeNames = Array.from(options.attributeNames);
          expect(attributeNames).not.to.be.undefined;
          expect(attributeNames).to.include.members(expected);

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

          const attributeNames = Array.from(options.attributeNames);
          expect(attributeNames).not.to.be.undefined;
          expect(attributeNames).to.include.members(expected);

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
          pattern: idNamePattern,
          reserved: reservedIds,
          prefix: keepIdPrefix,
          description: failureMessage,
        } = testCase;

        const files = [{ type: language, content: input }];

        const htmlIdMangler = new HtmlIdMangler({
          idNamePattern: idNamePattern || DEFAULT_PATTERN,
          reservedIds: reservedIds,
          keepIdPrefix: keepIdPrefix,
        });

        const result = webmangler(files, {
          plugins: [htmlIdMangler],
          languages: [builtInLanguages],
        });
        expect(result).to.have.length(1);

        const out = result[0];
        expect(out.content).to.equal(expected, failureMessage);
      }
    });
  }
}
