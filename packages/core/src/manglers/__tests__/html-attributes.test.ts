import type { TestScenario } from "@webmangler/testing";
import type {
  SelectorBeforeAndAfter,
  SelectorPairBeforeAndAfter,
  TestCase,
} from "./types";

import { WebManglerFileMock } from "@webmangler/testing";
import { expect } from "chai";
import { format as printf } from "util";

import {
  ATTRIBUTE_SELECTOR_OPERATORS,
  CSS_PROPERTIES,
  CSS_VALUES,
  PSEUDO_ELEMENT_SELECTORS,
  PSEUDO_SELECTORS,
  SELECTOR_COMBINATORS,
  TYPE_OR_UNITS,
} from "./css-constants";
import { UNCHANGING_ATTRIBUTES_TEST_SAMPLE } from "./html-fixtures";
import {
  embedAttributesInTags,
  embedDeclarationsInStyle,
  withOtherAttributes,
} from "./html-helpers";
import {
  getArrayOfFormattedStrings,
  isValidAttributeName,
  varyCssQuotes,
  varyHtmlQuotes,
  varyJsQuotes,
  varySpacing,
} from "./test-helpers";


import { ALL_CHARS } from "../../characters";
import webmangler from "../../index";
import BuiltInLanguageSupport from "../../languages/builtin";
import HtmlAttributeMangler from "../html-attributes";

const builtInLanguages = new BuiltInLanguageSupport();

const DEFAULT_PATTERN = "data-[a-z]+";
const SELECTORS: SelectorBeforeAndAfter[] = [
  { before: ":root", after: ":root" },
  { before: "div", after: "div" },
  { before: "#foobar", after: "#foobar" },
  { before: ".foobar", after: ".foobar" },
  { before: "[data-foo]", after: "[data-a]" },
  { before: "[href]", after: "[href]" },
  { before: "div[data-foo]", after: "div[data-a]" },
  { before: "div[href]", after: "div[href]" },
  { before: "#foo[data-bar]", after: "#foo[data-a]" },
  { before: "#foobar[href]", after: "#foobar[href]" },
  { before: ".foo[data-bar]", after: ".foo[data-a]" },
  { before: ".foobar[href]", after: ".foobar[href]" },
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
  { beforeA: "[data-foo]", beforeB: "[data-bar]", afterA: "[data-a]", afterB: "[data-b]" },
  { beforeA: "[data-foo]", beforeB: "[href]", afterA: "[data-a]", afterB: "[href]" },
  { beforeA: "[href]", beforeB: "[data-bar]", afterA: "[href]", afterB: "[data-a]" },
  { beforeA: "[data-foo]", beforeB: "[data-foo]", afterA: "[data-a]", afterB: "[data-a]" },
];
const ATTRIBUTES: SelectorBeforeAndAfter[] = [
  { before: "href", after: "href" },
  { before: "data-foo", after: "data-a" },
];

suite("HTML Attribute Mangler", function() {
  const varyCommaSpacing = varySpacing(",");

  suite("CSS", function() {
    const varyAttributeSelectorSpacing = varySpacing(["[", "]"]);

    const scenarios: TestScenario<TestCase>[] = [
      {
        name: "individual selectors",
        cases: [
          ...SELECTORS
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
            ])
            .flatMap(varyAttributeSelectorSpacing),
          ...ATTRIBUTE_SELECTOR_OPERATORS
            .flatMap((operator: string): TestCase[] => [
              ...varySpacing(operator, {
                input: `[data-foo${operator}"bar"]{ }`,
                expected: `[data-a${operator}"bar"]{ }`,
              }),
            ])
            .flatMap(varyCssQuotes),
        ],
      },
      {
        name: "multiple selectors",
        cases: [
          ...SELECTOR_PAIRS
            .flatMap(({ beforeA, beforeB, afterA, afterB }): TestCase[] => [
              {
                input: `${beforeA} { } ${beforeB} { }`,
                expected: `${afterA} { } ${afterB} { }`,
              },
              ...SELECTOR_COMBINATORS
                .flatMap((connector: string): TestCase[] => [
                  ...varySpacing(connector, {
                    input: `${beforeA}${connector}${beforeB} { }`,
                    expected: `${afterA}${connector}${afterB} { }`,
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
            ])
            .flatMap(varyAttributeSelectorSpacing),
          ...SELECTOR_COMBINATORS
            .flatMap((connector) => [
              {
                input: `[data-foo]${connector}div[data-bar] { }`,
                expected: `[data-a]${connector}div[data-b] { }`,
              },
            ]),
        ],
      },
      {
        name: "value usage",
        cases: ATTRIBUTES
          .flatMap(({ before, after }): TestCase[] => [
            {
              input: `div { content: attr(${before}); }`,
              expected: `div { content: attr(${after}); }`,
            },
            ...TYPE_OR_UNITS
              .flatMap((typeOrUnit): TestCase[] => [
                {
                  input: `div { content: attr(${before} ${typeOrUnit}); }`,
                  expected: `div { content: attr(${after} ${typeOrUnit}); }`,
                },
              ]),
            ...CSS_VALUES
              .flatMap((value): TestCase[] => [
                {
                  input: `div { content: attr(${before},${value}); }`,
                  expected: `div { content: attr(${after},${value}); }`,
                },
                ...TYPE_OR_UNITS
                  .flatMap((typeOrUnit): TestCase[] => [
                    {
                      input: `
                        div { content: attr(${before} ${typeOrUnit},${value}); }
                      `,
                      expected: `
                        div { content: attr(${after} ${typeOrUnit},${value}); }
                      `,
                    },
                  ])
                  .flatMap(varyCommaSpacing),
              ]),
          ])
          .flatMap(varyCssQuotes),
      },
      {
        name: "other selectors that match the pattern(s)",
        cases: [
          {
            input: "div[div] { }",
            expected: "div[data-a] { }",
            pattern: "[a-z]+",
          },
          {
            input: "#data-foo[data-foo] { }",
            expected: "#data-foo[data-a] { }",
          },
          {
            input: ".data-foo[data-foo] { }",
            expected: ".data-foo[data-a] { }",
          },
          ...PSEUDO_SELECTORS
            .filter(isValidAttributeName)
            .flatMap((pseudoSelector: string): TestCase[] => [
              {
                input: `input:${pseudoSelector} { } [${pseudoSelector}] { }`,
                expected: `input:${pseudoSelector} { } [data-a] { }`,
                pattern: "[a-zA-Z-]+",
              },
            ]),
          ...PSEUDO_ELEMENT_SELECTORS
            .filter(isValidAttributeName)
            .flatMap((pseudoElement: string): TestCase[] => [
              {
                input: `div::${pseudoElement} { } [${pseudoElement}] { }`,
                expected: `div::${pseudoElement} { } [data-a] { }`,
                pattern: "[a-zA-Z-]+",
              },
            ]),
        ],
      },
      {
        name: "strings that match the pattern",
        cases: [
          ...varyCssQuotes({
            input: "div[data-foo] { content: \"[data-foo]\"; }",
            expected: "div[data-a] { content: \"[data-foo]\"; }",
          }),
          ...varyCssQuotes({
            input: "div[data-foo] { content: \"attr(data-foo);\"; }",
            expected: "div[data-a] { content: \"attr(data-foo);\"; }",
          }),
          ...ATTRIBUTE_SELECTOR_OPERATORS
            .flatMap((operator: string): TestCase[] => [
              {
                input: `div[data-foo${operator}"data-foo"] { }`,
                expected: `div[data-a${operator}"data-foo"] { }`,
              },
              {
                input: `div[data-foo${operator}"attr(data-foo)"] { }`,
                expected: `div[data-a${operator}"attr(data-foo)"] { }`,
              },
            ])
            .flatMap(varyCssQuotes),
          ...varyCssQuotes({
            input: "div { content: \"[data-foo]\"; font: attr(data-foo); }",
            expected: "div { content: \"[data-foo]\"; font: attr(data-a); }",
          }),
          ...varyCssQuotes({
            input: "div { content: \"attr(data-foo);\"; font: attr(data-foo); }",
            expected: "div { content: \"attr(data-foo);\"; font: attr(data-a); }",
          }),
        ],
      },
      {
        name: "edge cases, selectors",
        cases: [
          {
            input: "[data-foo]",
            expected: "[data-a]",
            description: "dangling attribute selectors should be mangled",
          },
          {
            input: "div{}[data-foo]{}",
            expected: "div{}[data-a]{}",
            description: "lack of spacing around curly braces should not prevent mangling",
          },
          ...["[", "]", "="]
            .flatMap((unexpectedString: string): TestCase[] => [
              {
                input: `[data-foo="${unexpectedString}"] { }`,
                expected: `[data-a="${unexpectedString}"] { }`,
                description: "unexpected attribute values should not prevent mangling",
              },
            ])
            .flatMap(varyCssQuotes),
        ],
      },
      {
        name: "edge cases, usage",
        cases: [
          {
            input: ":root{color: attr(data-foo);}",
            expected: ":root{color: attr(data-a);}",
            description: "lack of spacing around curly braces should not prevent mangling",
          },
          {
            input: ":root { color: attr(data-foo) }",
            expected: ":root { color: attr(data-a) }",
            description: "lack of semicolon should not prevent mangling",
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
            pattern: attrNamePattern,
            reserved: reservedAttrNames,
            prefix: keepAttrPrefix,
            description: failureMessage,
          } = testCase;

          const files = [new WebManglerFileMock("css", input)];

          const htmlAttributeMangler = new HtmlAttributeMangler({
            attrNamePattern: attrNamePattern || DEFAULT_PATTERN,
            reservedAttrNames: reservedAttrNames,
            keepAttrPrefix: keepAttrPrefix,
          });

          const result = webmangler(files, {
            plugins: [htmlAttributeMangler],
            languages: [builtInLanguages],
          });
          expect(result).to.have.length(1);

          const out = result[0];
          expect(out.content).to.equal(expected, failureMessage);
        }
      });
    }
  });

  suite("HTML", function() {
    const varyAttributeSpacing = varySpacing(["=", "\""]);
    const varyDeclarationSpacing = varySpacing([":", "(", ")", ";"]);

    const SAMPLE_ATTRIBUTES: TestCase[] = [
      {
        input: "data-foo=\"bar\" data-hello=\"world\"",
        expected: "data-a=\"bar\" data-b=\"world\"",
      },
      {
        input: "data-foobar",
        expected: "data-a",
      },
    ];
    const SAMPLE_ATTRIBUTE_PAIRS: [TestCase, TestCase][] = [
      [
        {
          input: "data-foo=\"bar\"",
          expected: "data-a=\"bar\"",
        },
        {
          input: "data-hello=\"world\"",
          expected: "data-b=\"world\"",
        },
      ],
      [
        {
          input: "data-foo",
          expected: "data-a",
        },
        {
          input: "data-bar",
          expected: "data-b",
        },
      ],
      [
        {
          input: "data-praise=\"the\"",
          expected: "data-a=\"the\"",
        },
        {
          input: "data-sun",
          expected: "data-b",
        },
      ],
      [
        {
          input: "data-praise",
          expected: "data-a",
        },
        {
          input: "data-the=\"sun\"",
          expected: "data-b=\"sun\"",
        },
      ],
      [
        {
          input: "data-foo=\"bar\"",
          expected: "data-a=\"bar\"",
        },
        {
          input: "data-foo=\"baz\"",
          expected: "data-a=\"baz\"",
        },
      ],
      [
        {
          input: "data-foobar",
          expected: "data-a",
        },
        {
          input: "data-foobar",
          expected: "data-a",
        },
      ],
      [
        {
          input: "data-foo=\"bar\"",
          expected: "data-a=\"bar\"",
        },
        {
          input: "data-foo",
          expected: "data-a",
        },
      ],
    ];
    const SAMPLE_ATTRIBUTE_USAGE: TestCase[] = [
      {
        input: "attr(data-foo)",
        expected: "attr(data-a)",
      },
      {
        input: "attr(data-foo px)",
        expected: "attr(data-a px)",
      },
      {
        input: "attr(data-foo, 42)",
        expected: "attr(data-a, 42)",
      },
      {
        input: "attr(data-foo px, 42)",
        expected: "attr(data-a px, 42)",
      },
    ];

    const attrScenarios: TestScenario<TestCase>[] = [
      {
        name: "no (matching) attributes",
        cases: [
          ...UNCHANGING_ATTRIBUTES_TEST_SAMPLE
            .filter((testCase) => /\sdata-[a-z]+/.test(testCase.input)),
        ]
        .flatMap(varyHtmlQuotes)
        .flatMap(embedAttributesInTags),
      },
      {
        name: "varying spacing in attributes",
        cases: [
          ...SAMPLE_ATTRIBUTES,
          ...SAMPLE_ATTRIBUTE_PAIRS
            .map(([testCaseA, testCaseB]): TestCase => ({
              input: `${testCaseA.input} ${testCaseB.input}`,
              expected: `${testCaseA.expected} ${testCaseB.expected}`,
            })),
        ]
        .flatMap(embedAttributesInTags)
        .flatMap(varyAttributeSpacing),
      },
      {
        name: "with other attributes",
        cases: [
          ...SAMPLE_ATTRIBUTES,
          ...SAMPLE_ATTRIBUTE_PAIRS,
        ]
        .flatMap(withOtherAttributes)
        .flatMap(embedAttributesInTags),
      },
      {
        name: "attribute-like strings in non-attribute places",
        cases: [
          {
            input: "<div class=\"data-foo\"></div>",
            expected: "<div class=\"data-foo\"></div>",
            description: "matches inside attribute value should be ignored",
          },
          {
            input: "<div>data-foo is an attribute name</div>",
            expected: "<div>data-foo is an attribute name</div>",
            description: "matches outside an element tag should be ignored",
          },
        ],
      },
      {
        name: "edge cases",
        cases: [
          {
            input: "<div data-foo=\">\" data-bar=\"foo\"></div>",
            expected: "<div data-a=\">\" data-b=\"foo\"></div>",
            description: "closing `>` inside attribute values should be ignored",
          },
          {
            input: "< div data-foo=\"bar\"></div>",
            expected: "< div data-a=\"bar\"></div>",
            description: "ignore spacing before opening tag",
          },
        ],
      },
    ];

    const styleScenarios: TestScenario<TestCase>[] = [
      {
        name: "attribute value usage",
        cases: ATTRIBUTES
          .map(({ before, after }): TestCase => ({
            input: `<div style="content:attr(${before});"></div>`,
            expected: `<div style="content:attr(${after});"></div>`,
          }))
          .flatMap(varyDeclarationSpacing)
          .flatMap(varyHtmlQuotes),
      },
      {
        name: "attribute value usage with type/unit",
        cases: ATTRIBUTES
          .flatMap(({ before, after }): TestCase[] => [
            ...TYPE_OR_UNITS
              .flatMap((typeOrUnit: string): TestCase => ({
                input: `
                  <div style="content: attr(${before} ${typeOrUnit});"></div>
                `,
                expected: `
                  <div style="content: attr(${after} ${typeOrUnit});"></div>
                `,
              })),
          ]),
      },
      {
        name: "attribute value usage with default",
        cases: ATTRIBUTES
          .flatMap(({ before, after }): TestCase[] => [
            ...varySpacing(["(", ",", ")"], {
              input: `<div style="content: attr(${before},42);"></div>`,
              expected: `<div style="content: attr(${after},42);"></div>`,
            }),
            ...CSS_VALUES
              .map((value: string): TestCase => ({
                input: `
                  <div style="content: attr(${before}, ${value});"></div>
                `,
                expected: `
                  <div style="content: attr(${after}, ${value});"></div>
                `,
              })),
          ]),
      },
      {
        name: "attribute value usage with type/unit and default",
        cases: ATTRIBUTES
          .flatMap(({ before, after }): TestCase[] => [
            ...varySpacing(["(", ",", ")"], {
              input: `<div style="content: attr(${before} px,42);"></div>`,
              expected: `<div style="content: attr(${after} px,42);"></div>`,
            }),
            ...CSS_VALUES
              .flatMap((value: string): TestCase[] => [
                ...TYPE_OR_UNITS
                  .flatMap((typeOrUnit: string): TestCase => ({
                    input: `
                      <div style=
                        "content: attr(${before} ${typeOrUnit},${value});">
                      </div>
                    `,
                    expected: `
                      <div style=
                        "content: attr(${after} ${typeOrUnit},${value});">
                      </div>
                    `,
                  })),
              ]),
          ]),
      },
      {
        name: "attribute value usage with various properties",
        cases: SAMPLE_ATTRIBUTE_USAGE
          .flatMap((testCase: TestCase): TestCase[] => [
            ...CSS_PROPERTIES
              .map((property: string) => ({
                input: `${property}: ${testCase.input}`,
                expected: `${property}: ${testCase.expected}`,
              })),
          ])
          .map(embedDeclarationsInStyle)
          .flatMap(embedAttributesInTags),
      },
      {
        name: "attribute value usage with other attributes",
        cases: SAMPLE_ATTRIBUTE_USAGE
          .map((testCase: TestCase): TestCase => ({
            input: `content: ${testCase.input}`,
            expected: `content: ${testCase.expected}`,
          }))
          .map(embedDeclarationsInStyle)
          .flatMap(withOtherAttributes)
          .flatMap(embedAttributesInTags),
      },
      {
        name: "attribute value usage with other declarations",
        cases: SAMPLE_ATTRIBUTE_USAGE
          .flatMap((testCase: TestCase): TestCase[] => [
            {
              input: `content: ${testCase.input}`,
              expected: `content: ${testCase.expected}`,
            },
            {
              input: `color: red; content: ${testCase.input}`,
              expected: `color: red; content: ${testCase.expected}`,
            },
            {
              input: `content: ${testCase.input}; background: blue;`,
              expected: `content: ${testCase.expected}; background: blue;`,
            },
            {
              input: `
                color: red; content: ${testCase.input}; background: blue;
              `,
              expected: `
                color: red; content: ${testCase.expected}; background: blue;
              `,
            },
          ])
          .map(embedDeclarationsInStyle)
          .flatMap(withOtherAttributes)
          .flatMap(embedAttributesInTags),
      },
      {
        name: "edge cases",
        cases: [
          ...varySpacing("\"", {
            input: "<div style=\"content: attr(data-foo)\"></div>",
            expected: "<div style=\"content: attr(data-a)\"></div>",
            description: "missing closing semicolon is allowed",
          }),
        ],
      },
    ];

    for (const { name, cases } of [...attrScenarios, ...styleScenarios]) {
      test(name, function() {
        for (const testCase of cases) {
          const {
            input,
            expected,
            pattern: attrNamePattern,
            reserved: reservedAttrNames,
            prefix: keepAttrPrefix,
            description: failureMessage,
          } = testCase;

          const files = [new WebManglerFileMock("html", input)];

          const htmlAttributeMangler = new HtmlAttributeMangler({
            attrNamePattern: attrNamePattern || DEFAULT_PATTERN,
            reservedAttrNames: reservedAttrNames,
            keepAttrPrefix: keepAttrPrefix,
          });

          const result = webmangler(files, {
            plugins: [htmlAttributeMangler],
            languages: [builtInLanguages],
          });
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
        name: "single attribute selectors",
        cases: [
          ...varyJsQuotes({
            input: "document.querySelectorAll(\"[data-foo]\");",
            expected: "document.querySelectorAll(\"[data-a]\");",
          }),
          ...varyJsQuotes({
            input: "document.querySelectorAll(\".foo[data-bar]\");",
            expected: "document.querySelectorAll(\".foo[data-a]\");",
          }),
          ...varySpacing(["[", "]"], {
            input: "document.querySelectorAll(\".foo[data-bar]\");",
            expected: "document.querySelectorAll(\".foo[data-a]\");",
          }),
        ],
      },
      {
        name: "multiple attribute selectors",
        cases: [
          ...SELECTOR_COMBINATORS.map((connector) => {
            return {
              input: `"[data-foo]${connector}div[data-bar]"`,
              expected: `"[data-a]${connector}div[data-b]"`,
            };
          }),
          ...varyJsQuotes({
            input: "document.querySelectorAll(\"a[href] span[data-foobar]\");",
            expected: "document.querySelectorAll(\"a[href] span[data-a]\");",
          }),
          ...varySpacing(["[", "]"], {
            input: "document.querySelectorAll(\"span[data-foobar] a[href]\");",
            expected: "document.querySelectorAll(\"span[data-a] a[href]\");",
          }),
          ...varyJsQuotes({
            input: "document.querySelectorAll(\"p[data-foo] b[data-bar]\");",
            expected: "document.querySelectorAll(\"p[data-a] b[data-b]\");",
          }),
          ...varyJsQuotes({
            input: "document.querySelectorAll(\"[data-foo][data-bar]\");",
            expected: "document.querySelectorAll(\"[data-a][data-b]\");",
          }),
          ...varySpacing(["[", "]"], {
            input: "document.querySelectorAll(\"[data-foo][data-bar]\");",
            expected: "document.querySelectorAll(\"[data-a][data-b]\");",
          }),
        ],
      },
      {
        name: "attribute value selector",
        cases: [
          {
            input: "[data-foo=\\\"bar\\\"]",
            expected: "[data-a=\\\"bar\\\"]",
          },
          {
            input: "[data-foo|=\\\"bar\\\"]",
            expected: "[data-a|=\\\"bar\\\"]",
          },
          {
            input: "[data-foo~=\\\"bar\\\"]",
            expected: "[data-a~=\\\"bar\\\"]",
          },
          {
            input: "[data-foo^=\\\"bar\\\"]",
            expected: "[data-a^=\\\"bar\\\"]",
          },
          {
            input: "[data-foo$=\\\"bar\\\"]",
            expected: "[data-a$=\\\"bar\\\"]",
          },
          {
            input: "[data-foo*=\\\"bar\\\"]",
            expected: "[data-a*=\\\"bar\\\"]",
          },
        ]
        .flatMap(varyCssQuotes)
        .flatMap((testCase) => [
          ...varyJsQuotes({
            input: "var s = \"%s\";",
            expected: "var s = \"%s\";",
          }).map((template) => ({
            input: printf(template.input, testCase.input),
            expected: printf(template.expected, testCase.expected),
          })),
        ]),
      },
      {
        name: "attribute selectors with pseudo selectors",
        cases: [
          ...PSEUDO_SELECTORS.map((s: string): TestCase => ({
            input: `querySelector("[data-foo]:${s}");`,
            expected: `querySelector("[data-a]:${s}");`,
          })),
          ...PSEUDO_ELEMENT_SELECTORS.map((s: string): TestCase => ({
            input: `querySelector("[data-foo]::${s}");`,
            expected: `querySelector("[data-a]::${s}");`,
          })),
        ],
      },
      {
        name: "inverted attribute selectors",
        cases: [
          ...varySpacing(["(", ")"], {
            input: "var s= \":not([data-foo])\";",
            expected: "var s= \":not([data-a])\";",
          }),
        ],
      },
      {
        name: "attribute manipulation",
        cases: [
          ...varyJsQuotes({
            input: "$el.getAttribute(\"data-foo\");",
            expected: "$el.getAttribute(\"data-a\");",
          }),
          ...varySpacing("\"", {
            input: "$el.removeAttribute(\"data-bar\");",
            expected: "$el.removeAttribute(\"data-a\");",
          }),
          ...varyJsQuotes({
            input: "let attr = \"data-foo\"; $el.setAttribute(attr, \"bar\");",
            expected: "let attr = \"data-a\"; $el.setAttribute(attr, \"bar\");",
          }),
        ],
      },
      {
        name: "edge cases",
        cases: [
          {
            input: "document.querySelectorAll(\".data-foo\");",
            expected: "document.querySelectorAll(\".data-foo\");",
            description: "class selector matching pattern should not be mangled",
          },
          {
            input: "querySelector(\".data-foo[data-foo]\");",
            expected: "querySelector(\".data-foo[data-a]\");",
            description: "class selector matching pattern should not be mangled",
          },
          {
            input: "document.querySelectorAll(\"#data-foo\");",
            expected: "document.querySelectorAll(\"#data-foo\");",
            description: "ID selector matching pattern should not be mangled",
          },
          {
            input: "querySelector(\"#data-foo[data-foo]\");",
            expected: "querySelector(\"#data-foo[data-a]\");",
            description: "ID selector matching pattern should not be mangled",
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
            pattern: attrNamePattern,
            reserved: reservedAttrNames,
            prefix: keepAttrPrefix,
            description: failureMessage,
          } = testCase;

          const files = [new WebManglerFileMock("js", input)];

          const htmlAttributeMangler = new HtmlAttributeMangler({
            attrNamePattern: attrNamePattern || DEFAULT_PATTERN,
            reservedAttrNames: reservedAttrNames,
            keepAttrPrefix: keepAttrPrefix,
          });

          const result = webmangler(files, {
            plugins: [htmlAttributeMangler],
            languages: [builtInLanguages],
          });
          expect(result).to.have.length(1);

          const out = result[0];
          expect(out.content).to.equal(expected, failureMessage);
        }
      });
    }
  });

  suite("Configuration", function() {
    suite("::attrNamePattern", function() {
      const DEFAULT_PATTERNS = ["data-[a-z-]+"];

      test("default patterns", function() {
        const htmlAttributeMangler = new HtmlAttributeMangler();
        const result = htmlAttributeMangler.options();
        expect(result).to.deep.include({ patterns: DEFAULT_PATTERNS });
      });

      test("custom pattern", function() {
        const pattern = "foo(bar|baz)-[a-z]+";

        const htmlAttributeMangler = new HtmlAttributeMangler({
          attrNamePattern: pattern,
        });
        const result = htmlAttributeMangler.options();
        expect(result).to.deep.include({ patterns: pattern });
      });

      test("custom patterns", function() {
        const patterns: string[] = ["foobar-[a-z]+", "foobar-[0-9]+"];

        const htmlAttributeMangler = new HtmlAttributeMangler({
          attrNamePattern: patterns,
        });
        const result = htmlAttributeMangler.options();
        expect(result).to.deep.include({ patterns: patterns });
      });
    });

    suite("::reservedAttrNames", function() {
      test("default reserved", function() {
        const htmlAttributeMangler = new HtmlAttributeMangler();
        const result = htmlAttributeMangler.options();
        expect(result).to.have.property("reservedNames").that.is.not.empty;
      });

      test("custom reserved", function() {
        const reserved: string[] = ["foo", "bar"];

        const htmlAttributeMangler = new HtmlAttributeMangler({
          reservedAttrNames: reserved,
        });
        const result = htmlAttributeMangler.options();
        expect(result).to.have.property("reservedNames");
        expect(result.reservedNames).to.include.members(reserved);
      });
    });

    suite("::keepAttrPrefix", function() {
      const DEFAULT_MANGLE_PREFIX = "data-";

      test("default prefix", function() {
        const htmlAttributeMangler = new HtmlAttributeMangler();
        const result = htmlAttributeMangler.options();
        expect(result).to.deep.include({ manglePrefix: DEFAULT_MANGLE_PREFIX });
      });

      test("custom prefix", function() {
        const prefix = "foobar";

        const htmlAttributeMangler = new HtmlAttributeMangler({
          keepAttrPrefix: prefix,
        });
        const result = htmlAttributeMangler.options();
        expect(result).to.deep.include({ manglePrefix: prefix });
      });
    });
  });

  suite("Illegal names", function() {
    const illegalNames: string[] = [
      " -", " _", " 1", " 2", " 3", " 4", " 5", " 6", " 7", " 8", " 9", " A",
      " B", " C", " D", " E", " F", " G", " H", " I", " J", " K", " L", " M",
      " N", " O", " P", " Q", " R", " S", " T", " U", " V", " W", " X", " Y",
      " Z",
    ];

    let content = "";

    suiteSetup(function() {
      const n = Array.from(ALL_CHARS).length;
      const nArray = getArrayOfFormattedStrings(n, "<div data-%s=\"foo\">");
      content = nArray.join("");
    });

    test("without extra reserved", function() {
      const files = [new WebManglerFileMock("html", content)];

      const htmlAttributeMangler = new HtmlAttributeMangler({
        attrNamePattern: "data-[0-9]+",
        keepAttrPrefix: "",
      });

      const result = webmangler(files, {
        plugins: [htmlAttributeMangler],
        languages: [builtInLanguages],
      });
      expect(result).to.have.lengthOf(1);

      const out = result[0];
      for (const illegalName of illegalNames) {
        expect(out.content).not.to.have.string(illegalName);
      }
    });

    test("with extra reserved", function() {
      const files = [new WebManglerFileMock("html", content)];

      const htmlAttributeMangler = new HtmlAttributeMangler({
        attrNamePattern: "data-[0-9]+",
        reservedAttrNames: ["a"],
        keepAttrPrefix: "",
      });

      const result = webmangler(files, {
        plugins: [htmlAttributeMangler],
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
