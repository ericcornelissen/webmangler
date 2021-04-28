import type { TestScenario } from "@webmangler/testing";
import type {
  SelectorBeforeAndAfter,
  SelectorPairBeforeAndAfter,
  TestCase,
} from "./types";

import { WebManglerFileMock } from "@webmangler/testing";
import { expect } from "chai";
import * as R from "ramda";
import { format as printf } from "util";

import {
  ATTRIBUTE_SELECTOR_OPERATORS,
  CSS_PROPERTIES,
  CSS_VALUES,
  CSS_VALUES_NO_STRINGS,
  PSEUDO_ELEMENT_SELECTORS,
  PSEUDO_SELECTORS,
  SELECTOR_COMBINATORS,
  TYPE_OR_UNITS,
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
  const varyAttributeSpacing = varySpacing(["=", "\""]);
  const varyTagSpacing = varySpacing(["<", ">"]);

  suite("CSS", function() {
    const varyAttributeSelectorSpacing = varySpacing(["[", "]"]);
    const varyCommaSpacing = varySpacing(",");

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
                input: `[data-foo${operator}bar]{ }`,
                expected: `[data-a${operator}bar]{ }`,
              }),
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
            {
              input: `div { margin: 0 attr(${before}); }`,
              expected: `div { margin: 0 attr(${after}); }`,
            },
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

    run("css", scenarios);
  });

  suite("HTML (attributes)", function() {
    const SAMPLE_ATTRIBUTES: TestCase[] = [
      {
        input: "data-foo=\"bar\"",
        expected: "data-a=\"bar\"",
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

    const scenarios: TestScenario<TestCase>[] = [
      {
        name: "no relevant content",
        cases: [
          ...UNCHANGING_ATTRIBUTES_TEST_SAMPLE
            .filter((testCase) => !/(\s|^)(data-[a-z]+)/.test(testCase.input)),
        ]
        .flatMap(varyHtmlQuotes)
        .flatMap(embedAttributesInTags),
      },
      {
        name: "as only attribute",
        cases: SAMPLE_ATTRIBUTES
          .flatMap(varyAttributeSpacing)
          .flatMap(varyHtmlQuotes)
          .flatMap(embedAttributesInTags),
      },
      {
        name: "with other attributes",
        cases: SAMPLE_ATTRIBUTES
          .flatMap(embedWithOtherAttributes)
          .flatMap(embedAttributesInTags),
      },
      {
        name: "on adjacent elements",
        cases: SAMPLE_ATTRIBUTE_PAIRS.flatMap(embedAttributesInAdjacentTags),
      },
      {
        name: "on nested elements",
        cases: SAMPLE_ATTRIBUTE_PAIRS.flatMap(embedAttributesInNestedTags),
      },
      {
        name: "attribute-like strings in HTML content",
        cases: [
          {
            input: "<div>data-foobar is an attribute name</div>",
            expected: "<div>data-foobar is an attribute name</div>",
          },
          {
            input: "<div data-foo>data-bar is an attribute name</div>",
            expected: "<div data-a>data-bar is an attribute name</div>",
          },
          {
            input: "<div data-praise=\"the\">data-sun is an attribute name</div>",
            expected: "<div data-a=\"the\">data-sun is an attribute name</div>",
          },
          {
            input: "<div data-foobar>data-foobar is an attribute name</div>",
            expected: "<div data-a>data-foobar is an attribute name</div>",
          },
          {
            input: "<div data-foo=\"bar\">data-foo is an attribute name</div>",
            expected: "<div data-a=\"bar\">data-foo is an attribute name</div>",
          },
          {
            input: "<div>data-foo=\"bar\" is an attribute</div>",
            expected: "<div>data-foo=\"bar\" is an attribute</div>",
          },
          {
            input: "<div data-foobar>data-hello=\"world\" is an attribute</div>",
            expected: "<div data-a>data-hello=\"world\" is an attribute</div>",
          },
          {
            input: "<div data-foo=\"bar\">data-hello=\"world\" is an attribute</div>",
            expected: "<div data-a=\"bar\">data-hello=\"world\" is an attribute</div>",
          },
          {
            input: "<div data-foo>data-foo=\"bar\" is an attribute</div>",
            expected: "<div data-a>data-foo=\"bar\" is an attribute</div>",
          },
          {
            input: "<div data-foo=\"bar\">data-foo=\"bar\" is an attribute</div>",
            expected: "<div data-a=\"bar\">data-foo=\"bar\" is an attribute</div>",
          },
        ].flatMap(varyTagSpacing),
      },
      {
        name: "attribute-like strings in attribute values",
        cases: [
          {
            input: "data-foo=\"data-bar\"",
            expected: "data-a=\"data-bar\"",
          },
          {
            input: "data-foobar data-foo=\"data-bar\"",
            expected: "data-a data-b=\"data-bar\"",
          },
          {
            input: "data-hello=\"world\" data-foo=\"data-bar\"",
            expected: "data-a=\"world\" data-b=\"data-bar\"",
          },
          {
            input: "data-bar data-foo=\"data-bar\"",
            expected: "data-a data-b=\"data-bar\"",
          },
          {
            input: "data-foo=\"bar\" data-bar=\"data-foo\"",
            expected: "data-a=\"bar\" data-b=\"data-foo\"",
          },
          ...HTML_ATTRIBUTES
            .filter((attribute: string) => !/^(data-[a-z]+)$/.test(attribute))
            .flatMap((attribute: string): TestCase[] => [
              {
                input: `${attribute}="data-foobar"`,
                expected: `${attribute}="data-foobar"`,
              },
              {
                input: `data-foo ${attribute}="data-bar"`,
                expected: `data-a ${attribute}="data-bar"`,
              },
              {
                input: `data-praise="the" ${attribute}="data-sun"`,
                expected: `data-a="the" ${attribute}="data-sun"`,
              },
              {
                input: `data-foobar ${attribute}="data-foobar"`,
                expected: `data-a ${attribute}="data-foobar"`,
              },
              {
                input: `data-foo="bar" ${attribute}="data-foo"`,
                expected: `data-a="bar" ${attribute}="data-foo"`,
              },
            ]),
        ].flatMap(embedAttributesInTags),
      },
      {
        name: "non-closing \">\"",
        cases: [
          {
            input: "id=\">\" data-foo=\"bar\"",
            expected: "id=\">\" data-a=\"bar\"",
          },
          {
            input: "data-foo=\"bar\" id=\">\"",
            expected: "data-a=\"bar\" id=\">\"",
          },
          {
            input: "data-praise=\">\" data-the=\"sun\"",
            expected: "data-a=\">\" data-b=\"sun\"",
          },
          {
            input: "data-praise=\"the\" data-sun=\">\"",
            expected: "data-a=\"the\" data-b=\">\"",
          },
        ].flatMap(embedAttributesInTags),
      },
      {
        name: "attribute repetition",
        cases: [
          {
            input: "data-foo=\"bar\" data-foo=\"baz\"",
            expected: "data-a=\"bar\" data-a=\"baz\"",
          },
          {
            input: "data-foo data-foo",
            expected: "data-a data-a",
          },
          {
            input: "data-foo=\"bar\" data-foo",
            expected: "data-a=\"bar\" data-a",
          },
          {
            input: "data-foo data-foo=\"baz\"",
            expected: "data-a data-a=\"baz\"",
          },
        ].flatMap(embedAttributesInTags),
      },
      {
        name: "prefixed & suffixed attributes",
        cases: [
          ...["x", "aria-"]
            .flatMap((prefix: string): TestCase[] => [
              {
                input: `${prefix}data-foobar`,
                expected: `${prefix}data-foobar`,
              },
              {
                input: `${prefix}data-foo data-bar`,
                expected: `${prefix}data-foo data-a`,
              },
              {
                input: `${prefix}data-foobar data-foobar`,
                expected: `${prefix}data-foobar data-a`,
              },
              {
                input: `${prefix}data-foo="bar"`,
                expected: `${prefix}data-foo="bar"`,
              },
              {
                input: `${prefix}data-praise="the" data-sun`,
                expected: `${prefix}data-praise="the" data-a`,
              },
              {
                input: `${prefix}data-foo="bar" data-foo`,
                expected: `${prefix}data-foo="bar" data-a`,
              },
            ]),
          ...["-x", "Aria"]
            .flatMap((suffix: string): TestCase[] => [
              {
                input: `data-foobar${suffix}`,
                expected: `data-foobar${suffix}`,
              },
              {
                input: `data-foo${suffix} data-bar`,
                expected: `data-foo${suffix} data-a`,
              },
              {
                input: `data-foobar${suffix} data-foobar`,
                expected: `data-foobar${suffix} data-a`,
              },
              {
                input: `data-foo${suffix}="bar"`,
                expected: `data-foo${suffix}="bar"`,
              },
              {
                input: `data-praise${suffix}="the" data-sun`,
                expected: `data-praise${suffix}="the" data-a`,
              },
              {
                input: `data-foo${suffix}="bar" data-foo`,
                expected: `data-foo${suffix}="bar" data-a`,
              },
            ]),
        ]
        .flatMap(embedWithOtherAttributes)
        .flatMap(embedAttributesInTags),
      },
    ];

    run("html", scenarios);
  });

  suite("HTML (style attribute)", function() {
    const embedDeclarationsInStyle = embedAttributeValue("style");

    const varyDeclarationSpacing = varySpacing([":", ",", ";"]);

    type TestInstance = {
      readonly name: string;
      factory(idBefore: string, idAfter: string): TestCase[];
    }

    const instances: TestInstance[] = [
      {
        name: "attribute usage",
        factory: (before: string, after: string): TestCase[] => [
          ...CSS_PROPERTIES
            .map((property: string): TestCase => ({
              input: `${property}:attr(${before});`,
              expected: `${property}:attr(${after});`,
            })),
        ],
      },
      {
        name: "attribute usage with default",
        factory: (before: string, after: string): TestCase[] => [
          ...CSS_VALUES_NO_STRINGS
            .map((value: string): TestCase => ({
              input: `content:attr(${before},${value});`,
              expected: `content:attr(${after},${value});`,
            })),
        ],
      },
      {
        name: "attribute usage with type/unit",
        factory: (before: string, after: string): TestCase[] => [
          ...TYPE_OR_UNITS
            .map((typeOrUnit: string): TestCase => ({
              input: `content:attr(${before} ${typeOrUnit});`,
              expected: `content:attr(${after} ${typeOrUnit});`,
            })),
        ],
      },
      {
        name: "attribute usage with default and type/unit (different properties)",
        factory: (before: string, after: string): TestCase[] => [
          ...CSS_PROPERTIES
            .map((property: string): TestCase => ({
              input: `${property}:attr(${before} px,42);`,
              expected: `${property}:attr(${after} px,42);`,
            })),
        ],
      },
      {
        name: "attribute usage with default and type/unit (different types/units)",
        factory: (before: string, after: string): TestCase[] => [
          ...TYPE_OR_UNITS
            .map((typeOrUnit: string): TestCase => ({
              input: `content:attr(${before} ${typeOrUnit},42);`,
              expected: `content:attr(${after} ${typeOrUnit},42);`,
            })),
        ],
      },
      {
        name: "attribute usage with default and type/unit (different values)",
        factory: (before: string, after: string): TestCase[] => [
          ...CSS_VALUES_NO_STRINGS
            .map((value: string): TestCase => ({
              input: `content:attr(${before} px,${value});`,
              expected: `content:attr(${after} px,${value});`,
            })),
        ],
      },
    ];

    const scenarios: TestScenario<TestCase>[] = [
      {
        name: "no relevant content",
        cases: [
          {
            input: "style=\"color:red;\"",
            expected: "style=\"color:red;\"",
          },
          ...UNCHANGING_ATTRIBUTES_TEST_SAMPLE
            .filter((testCase) => /(\s|^)(style)=/.test(testCase.input)),
        ]
        .flatMap(varyHtmlQuotes)
        .flatMap(embedAttributesInTags),
      },
      {
        name: "valueless style attribute",
        cases: [
          {
            input: "style",
            expected: "style",
          },
          {
            input: "style=\"\"",
            expected: "style=\"\"",
          },
        ]
        .flatMap(varyAttributeSpacing)
        .flatMap(varyHtmlQuotes)
        .flatMap(embedWithOtherAttributes)
        .flatMap(embedAttributesInTags),
      },
      {
        name: "style as tag",
        cases: [
          {
            input: "<style class=\"foobar\"></style>",
            expected: "<style class=\"foobar\"></style>",
          },
          ...varySpacing("/", {
            input: "<style class=\"foobar\"/>",
            expected: "<style class=\"foobar\"/>",
          }),
        ],
      },
    ];

    for (const instance of instances) {
      const { name, factory } = instance;

      const PAIRS: [TestCase, TestCase][] = [
        [factory("data-foo", "data-a"), factory("data-bar", "data-b")],
        [factory("data-foobar", "data-a"), factory("data-foobar", "data-a")],
      ].flatMap(([testCasesA, testCasesB]): [TestCase, TestCase][] => {
        return R.zip(
          testCasesA.map(embedDeclarationsInStyle),
          testCasesB.map(embedDeclarationsInStyle),
        );
      });

      scenarios.push(...[
        {
          name: `no matching ${name} in a style attribute`,
          cases: factory("foobar", "foobar")
            .map(embedDeclarationsInStyle)
            .flatMap(varyHtmlQuotes)
            .flatMap(embedAttributesInTags),
        },
        {
          name: `${name} by itself in a style attribute`,
          cases: factory("data-foobar", "data-a")
            .map(embedDeclarationsInStyle)
            .flatMap(varyAttributeSpacing)
            .flatMap(varyHtmlQuotes)
            .flatMap(embedAttributesInTags),
        },
        {
          name: `${name}, vary spacing`,
          cases: factory("data-foobar", "data-a")
            .map(embedDeclarationsInStyle)
            .flatMap(varyDeclarationSpacing)
            .flatMap(embedAttributesInTags),
        },
        {
          name: `${name} by itself in a style attribute with other attributes`,
          cases: factory("data-foobar", "data-a")
            .map(embedDeclarationsInStyle)
            .flatMap(embedWithOtherAttributes)
            .flatMap(embedAttributesInTags),
        },
        {
          name: `${name} with other declarations in a style attribute`,
          cases: factory("data-foobar", "data-a")
            .flatMap((testCase: TestCase): TestCase[] => [
              {
                input: `color:red;${testCase.input}`,
                expected: `color:red;${testCase.expected}`,
              },
              {
                input: `${testCase.input};background:blue;`,
                expected: `${testCase.expected};background:blue;`,
              },
              {
                input: `color:red;${testCase.input};background:blue;`,
                expected: `color:red;${testCase.expected};background:blue;`,
              },
            ])
            .map(embedDeclarationsInStyle)
            .flatMap(embedAttributesInTags),
        },
        {
          name: `${name} in style attributes on adjacent elements`,
          cases: PAIRS.flatMap(embedAttributesInAdjacentTags),
        },
        {
          name: `${name} in style attributes on nested elements`,
          cases: PAIRS.flatMap(embedAttributesInNestedTags),
        },
        {
          name: `${name} strings in HTML content`,
          cases: factory("data-foobar", "data-a")
            .flatMap((testCase: TestCase): TestCase[] => [
              {
                input: `<div>${testCase.input}</div>`,
                expected: `<div>${testCase.input}</div>`,
              },
              {
                input: `
                  <div style="${testCase.input}">${testCase.input}</div>
                `,
                expected: `
                  <div style="${testCase.expected}">${testCase.input}</div>
                `,
              },
              {
                input: `<div>style="${testCase.input}"</div>`,
                expected: `<div>style="${testCase.input}"</div>`,
              },
              {
                input: `
                  <div style="${testCase.input}">
                    style="${testCase.input}"
                  </div>
                `,
                expected: `
                  <div style="${testCase.expected}">
                    style="${testCase.input}"
                  </div>
                `,
              },
            ])
            .flatMap(varyTagSpacing),
        },
        {
          name: `${name} strings in non-style attribute`,
          cases: factory("data-foobar", "data-a")
            .flatMap((testCase: TestCase): TestCase[] => [
              ...HTML_ATTRIBUTES
                .filter((attribute: string) => !/^(data-[a-z]+)$/.test(attribute))
                .flatMap((attribute: string): TestCase[] => [
                  {
                    input: `${attribute}="${testCase.input}"`,
                    expected: `${attribute}="${testCase.input}"`,
                  },
                  {
                    input: `
                      style="${testCase.input}"
                      ${attribute}="${testCase.input}"
                    `,
                    expected: `
                      style="${testCase.expected}"
                      ${attribute}="${testCase.input}"
                    `,
                  },
                ]),
              ...["x", "aria-"]
                .flatMap((prefix: string): TestCase[] => [
                  {
                    input: `${prefix}style="${testCase.input}"`,
                    expected: `${prefix}style="${testCase.input}"`,
                  },
                  {
                    input: `
                      style="${testCase.input}"
                      ${prefix}style="${testCase.input}"
                    `,
                    expected: `
                      style="${testCase.expected}"
                      ${prefix}style="${testCase.input}"
                    `,
                  },
                ]),
              ...["x", "-data"]
                .flatMap((suffix: string): TestCase[] => [
                  {
                    input: `style${suffix}="${testCase.input}"`,
                    expected: `style${suffix}="${testCase.input}"`,
                  },
                  {
                    input: `
                      style="${testCase.input}"
                      style${suffix}="${testCase.input}"
                    `,
                    expected: `
                      style="${testCase.expected}"
                      style${suffix}="${testCase.input}"
                    `,
                  },
                ]),
            ])
            .flatMap(embedAttributesInTags),
        },
        {
          name: `style-like attributes with ${name}`,
          cases: ["x", "aria-"]
            .flatMap((prefix: string): TestCase[] => {
              const attributeName = `${prefix}style`;
              const embedDeclarations = embedAttributeValue(attributeName);
              return factory("data-foo", "data-foo").map(embedDeclarations);
            })
            .flatMap(varyHtmlQuotes)
            .flatMap(embedWithOtherAttributes)
            .flatMap(embedAttributesInTags),
        },
        {
          name: `${name} with non-closing ">"`,
          cases: factory("data-foobar", "data-a")
            .flatMap((testCase: TestCase): TestCase[] => [
              {
                input: `id=">" style="${testCase.input}"`,
                expected: `id=">" style="${testCase.expected}"`,
              },
              {
                input: `style="${testCase.input}" id=">"`,
                expected: `style="${testCase.expected}" id=">"`,
              },
              {
                input: `style=">;${testCase.input}"`,
                expected: `style=">;${testCase.expected}"`,
              },
              {
                input: `style="${testCase.input};>;"`,
                expected: `style="${testCase.expected};>;"`,
              },
            ])
            .flatMap(embedAttributesInTags),
        },
        {
          name: `${name} with style attribute repetition`,
          cases: [
            ...PAIRS
              .map(([testCaseA, testCaseB]): TestCase => ({
                input: `${testCaseA.input} ${testCaseB.input}`,
                expected: `${testCaseA.expected} ${testCaseB.expected}`,
              })),
            ...factory("data-foobar", "data-a")
              .map((testCase: TestCase): TestCase => ({
                input: `
                  style="${testCase.input}" style="${testCase.input}"
                `,
                expected: `
                  style="${testCase.expected}" style="${testCase.expected}"
                `,
              })),
          ].flatMap(embedAttributesInTags),
        },
        {
          name: `${name} with style as tag`,
          cases: factory("data-foobar", "data-a")
            .flatMap((testCase: TestCase): TestCase[] => [
              {
                input: `<style style="${testCase.input}"></style>`,
                expected: `<style style="${testCase.expected}"></style>`,
              },
              ...varySpacing("/", {
                input: `<style style="${testCase.input}"/>`,
                expected: `<style style="${testCase.expected}"/>`,
              }),
            ]),
        },
        {
          name: `${name} with non-standard syntax`,
          cases: [
            ...factory("data-foobar", "data-a")
              .map((testCase: TestCase): TestCase => ({
                input: testCase.input.replace(";", ""),
                expected: testCase.expected.replace(";", ""),
                description: "missing \";\" should not matter",
              }))
              .map(embedDeclarationsInStyle)
              .flatMap(embedAttributesInTags),
          ],
        },
      ]);

      if (!factory("data-foobar", "data-a")[0].input.includes(" ")) {
        scenarios.push({
          name: `${name} in an unquoted style attribute`,
          cases: [
            ...factory("data-foobar", "data-a")
              .map(embedDeclarationsInStyle)
              .flatMap((testCase: TestCase): TestCase[] => [
                {
                  input: testCase.input.replace(/"/g, ""),
                  expected: testCase.expected.replace(/"/g, ""),
                },
                {
                  input: testCase.input.replace(/("|;)/g, ""),
                  expected: testCase.expected.replace(/("|;)/g, ""),
                },
              ])
              .flatMap(varyAttributeSpacing)
              .flatMap(embedAttributesInTags),
          ],
        });
      }
    }

    run("html", scenarios);
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
            input: "[data-foo=bar]",
            expected: "[data-a=bar]",
          },
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

    run("js", scenarios);
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
          pattern: attrNamePattern,
          reserved: reservedAttrNames,
          prefix: keepAttrPrefix,
          description: failureMessage,
        } = testCase;

        const files = [new WebManglerFileMock(language, input)];

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
}

