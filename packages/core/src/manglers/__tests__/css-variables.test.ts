import type { TestScenario } from "@webmangler/testing";
import type { TestCase } from "./types";

import { WebManglerFileMock } from "@webmangler/testing";
import { expect } from "chai";

import {
  CSS_PROPERTIES,
  CSS_VALUES,
  CSS_VALUES_NO_STRINGS,
} from "./css-constants";
import { SELF_CLOSING_TAGS, STANDARD_TAGS } from "./html-constants";
import { UNCHANGING_ATTRIBUTES_TEST_SAMPLE } from "./html-fixtures";
import {
  embedAttributesInTags,
  embedDeclarationsInStyle,
  withOtherAttributes,
} from "./html-helpers";
import {
  getArrayOfFormattedStrings,
  varyCssQuotes,
  varyHtmlQuotes,
  varyJsQuotes,
  varySpacing,
} from "./test-helpers";

import { ALL_CHARS } from "../../characters";
import webmangler from "../../index";
import BuiltInLanguageSupport from "../../languages/builtin";
import CssVariableMangler from "../css-variables";

const builtInLanguages = new BuiltInLanguageSupport();

const DEFAULT_PATTERN = "[a-z]+";

suite("CSS Variable Mangler", function() {
  const varyVariableUsageSpacing = varySpacing([":", "(", ",", ")"]);

  suite("CSS", function() {
    const varyDeclarationSpacing = varySpacing(["{", ":", ";", "}"]);

    const scenarios: TestScenario<TestCase>[] = [
      {
        name: "no declarations or usage",
        cases: [
          {
            input: ":root { font: serif; }",
            expected: ":root { font: serif; }",
          },
          {
            input: "div { color: red; }",
            expected: "div { color: red; }",
          },
          {
            input: ".foobar { font-size: 12px; }",
            expected: ".foobar { font-size: 12px; }",
          },
          {
            input: "#foo::before { content: 'bar'; }",
            expected: "#foo::before { content: 'bar'; }",
          },
          {
            input: "[data-foo] { background: #BA2; }",
            expected: "[data-foo] { background: #BA2; }",
          },
        ],
      },
      {
        name: "declarations",
        cases: [
          ...CSS_VALUES
            .flatMap((value: string): TestCase[] => [
              {
                input: `:root{--foo:${value};}`,
                expected: `:root{--a:${value};}`,
              },
            ])
            .flatMap(varyDeclarationSpacing),
          {
            input: ":root { background: purple; --foo: black; }",
            expected: ":root { background: purple; --a: black; }",
          },
          {
            input: ":root { --foo: black; font-size: 12px; }",
            expected: ":root { --a: black; font-size: 12px; }",
          },
          {
            input: ":root { background: purple; --foo: black; font-size: 12px; }",
            expected: ":root { background: purple; --a: black; font-size: 12px; }",
          },
          {
            input: ":root { --foo: black; --bar: yellow; }",
            expected: ":root { --a: black; --b: yellow; }",
          },
          {
            input: ".cls-1 { --foo: black; } .cls-2 { --bar: yellow; }",
            expected: ".cls-1 { --a: black; } .cls-2 { --b: yellow; }",
          },
        ],
      },
      {
        name: "usage without fallback",
        cases: [
          ...varySpacing(["(", ")"], {
            input: "div { color: var(--foo); }",
            expected: "div { color: var(--a); }",
          }),
          {
            input: "div { background: purple; color: var(--foo); }",
            expected: "div { background: purple; color: var(--a); }",
          },
          {
            input: "div { color: var(--foo); font-size: 12px; }",
            expected: "div { color: var(--a); font-size: 12px; }",
          },
          {
            input: "div { background: purple; color: var(--foo); font-size: 12px; }",
            expected: "div { background: purple; color: var(--a); font-size: 12px; }",
          },
          {
            input: "div { color: var(--foo); font: var(--bar); }",
            expected: "div { color: var(--a); font: var(--b); }",
          },
          {
            input: "div { color: var(--foo); } p { font: var(--bar); }",
            expected: "div { color: var(--a); } p { font: var(--b); }",
          },
        ],
      },
      {
        name: "usage with fallback",
        cases: [
          ...CSS_VALUES
            .flatMap((value: string): TestCase[] => [
              {
                input: `div { color: var(--foo,${value}); }`,
                expected: `div { color: var(--a,${value}); }`,
              },
            ])
            .flatMap(varyVariableUsageSpacing),
          {
            input: "div { background: black; color: var(--foo, yellow); }",
            expected: "div { background: black; color: var(--a, yellow); }",
          },
          {
            input: "div { color: var(--foo, purple); font-size: 12px; }",
            expected: "div { color: var(--a, purple); font-size: 12px; }",
          },
          {
            input: "div { background: black; color: var(--foo, yellow); font-size: 12px; }",
            expected: "div { background: black; color: var(--a, yellow); font-size: 12px; }",
          },
          {
            input: "div { color: var(--foo, purple); font: var(--bar, serif); }",
            expected: "div { color: var(--a, purple); font: var(--b, serif); }",
          },
          {
            input: "div { color: var(--foo, purple); } p { font: var(--bar, serif); }",
            expected: "div { color: var(--a, purple); } p { font: var(--b, serif); }",
          },
        ],
      },
      {
        name: "declarations & usage",
        cases: [
          {
            input: ":root { --foo: purple; } div { color: var(--foo); }",
            expected: ":root { --a: purple; } div { color: var(--a); }",
          },
          {
            input: ":root { --foo: purple; } div { color: var(--bar); }",
            expected: ":root { --a: purple; } div { color: var(--b); }",
          },
          {
            input: "div { --foo: purple; color: var(--foo); }",
            expected: "div { --a: purple; color: var(--a); }",
          },
          {
            input: "div { --foo: purple; color: var(--bar); }",
            expected: "div { --a: purple; color: var(--b); }",
          },
          {
            input: ":root { --foo: black; } div { color: var(--foo, yellow); }",
            expected: ":root { --a: black; } div { color: var(--a, yellow); }",
          },
          {
            input: ":root { --foo: black; } div { color: var(--bar, yellow); }",
            expected: ":root { --a: black; } div { color: var(--b, yellow); }",
          },
          {
            input: "div { --foo: black; color: var(--foo, yellow); }",
            expected: "div { --a: black; color: var(--a, yellow); }",
          },
          {
            input: "div { --foo: black; color: var(--bar, yellow); }",
            expected: "div { --a: black; color: var(--b, yellow); }",
          },
        ],
      },
      {
        name: "selectors that match the pattern(s)",
        cases: [
          {
            input: "#--foo { --foo: \"bar\"; }",
            expected: "#--foo { --a: \"bar\"; }",
          },
        ],
      },
      {
        name: "strings that match the pattern",
        cases: [
          ...varyCssQuotes({
            input: "div { content: \"--foo\"; --foo: \"bar\"; }",
            expected: "div { content: \"--foo\"; --a: \"bar\"; }",
          }),
          ...varyCssQuotes({
            input: "div { content: \"--foo\"; color: var(--foo); }",
            expected: "div { content: \"--foo\"; color: var(--a); }",
          }),
          ...varyCssQuotes({
            input: "div { content: \"var(--foo)\"; --foo: \"bar\"; }",
            expected: "div { content: \"var(--foo)\"; --a: \"bar\"; }",
          }),
          ...varyCssQuotes({
            input: "div { content: \"var(--foo)\"; color: var(--foo); }",
            expected: "div { content: \"var(--foo)\"; color: var(--a); }",
          }),
        ],
      },
      {
        name: "edge cases, declarations",
        cases: [
          {
            input: ":root{--foo: \"bar\";}",
            expected: ":root{--a: \"bar\";}",
            description: "lack of spacing around curly braces should not prevent mangling",
          },
          {
            input: ":root { --foo: \"bar\" }",
            expected: ":root { --a: \"bar\" }",
            description: "lack of semicolon should not prevent mangling",
          },
          ...["{", "}", ":"]
            .flatMap((unexpectedString: string): TestCase[] => [
              {
                input: `:root { --foo: "${unexpectedString}" }`,
                expected: `:root { --a: "${unexpectedString}" }`,
                description: "unexpected string values should not prevent mangling",
              },
            ])
            .flatMap(varyCssQuotes),
        ],
      },
      {
        name: "edge cases, usage",
        cases: [
          {
            input: ":root{color: var(--foo);}",
            expected: ":root{color: var(--a);}",
            description: "lack of spacing around curly braces should not prevent mangling",
          },
          {
            input: ":root { color: var(--foo) }",
            expected: ":root { color: var(--a) }",
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
            pattern: cssVarNamePattern,
            reserved: reservedCssVarNames,
            prefix: keepCssVarPrefix,
            description: failureMessage,
          } = testCase;

          const files = [new WebManglerFileMock("css", input)];

          const cssVariableMangler = new CssVariableMangler({
            cssVarNamePattern: cssVarNamePattern || DEFAULT_PATTERN,
            reservedCssVarNames: reservedCssVarNames,
            keepCssVarPrefix: keepCssVarPrefix,
          });

          const result = webmangler(files, {
            plugins: [cssVariableMangler],
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
    const varyDeclarationSpacing = varySpacing([":", "(", ",", ")", ";"]);
    const varyFunctionSpacing = varySpacing(["(", ",", ")"]);
    const varyColonSemicolonSpacing = varySpacing([":", ";"]);

    const SAMPLE_VARIABLE_DECLARATIONS: TestCase[] = [
      {
        input: "--foobar:42;",
        expected: "--a:42;",
      },
      {
        input: "font:var(--foobar);",
        expected: "font:var(--a);",
      },
      {
        input: "font:var(--foobar, serif);",
        expected: "font:var(--a, serif);",
      },
    ];

    const scenarios: TestScenario<TestCase>[] = [
      {
        name: "no CSS variables",
        cases: [
          {
            input: "style=\"color: red;\"",
            expected: "style=\"color: red;\"",
          },
          ...UNCHANGING_ATTRIBUTES_TEST_SAMPLE
            .filter((testCase) => /\sstyle=/.test(testCase.input)),
        ]
        .flatMap(varyHtmlQuotes)
        .flatMap(embedAttributesInTags),
      },
      {
        name: "varying spacing in attributes",
        cases: SAMPLE_VARIABLE_DECLARATIONS
          .map(embedDeclarationsInStyle)
          .flatMap(varyAttributeSpacing)
          .flatMap(embedAttributesInTags),
      },
      {
        name: "varying quotes",
        cases: SAMPLE_VARIABLE_DECLARATIONS
          .map(embedDeclarationsInStyle)
          .flatMap(varyHtmlQuotes)
          .flatMap(embedAttributesInTags),
      },
      {
        name: "varying spacing in declarations",
        cases: SAMPLE_VARIABLE_DECLARATIONS
          .map(embedDeclarationsInStyle)
          .flatMap(varyDeclarationSpacing)
          .flatMap(embedAttributesInTags),
      },
      {
        name: "with other attributes",
        cases: SAMPLE_VARIABLE_DECLARATIONS
          .map(embedDeclarationsInStyle)
          .flatMap(withOtherAttributes)
          .flatMap(embedAttributesInTags),
      },
      {
        name: "with other declarations in style attribute",
        cases: SAMPLE_VARIABLE_DECLARATIONS
          .flatMap((testCase: TestCase): TestCase[] => [
            {
              input: `${testCase.input}`,
              expected: `${testCase.expected}`,
            },
            {
              input: `color: red; ${testCase.input}`,
              expected: `color: red; ${testCase.expected}`,
            },
            {
              input: `${testCase.input}; background: blue;`,
              expected: `${testCase.expected}; background: blue;`,
            },
            {
              input: `color: red; ${testCase.input}; background: blue;`,
              expected: `color: red; ${testCase.expected}; background: blue;`,
            },
          ])
          .map(embedDeclarationsInStyle)
          .flatMap(embedAttributesInTags),
      },
      {
        name: "different variable values",
        cases: [
          ...CSS_VALUES_NO_STRINGS
            .flatMap((value: string): TestCase => ({
              input: `--foobar:${value};`,
              expected: `--a:${value};`,
            }))
            .flatMap(varyColonSemicolonSpacing),
          ...CSS_PROPERTIES
            .flatMap((property: string): TestCase => ({
              input: `${property}: var(--foobar);`,
              expected: `${property}: var(--a);`,
            }))
            .flatMap(varyFunctionSpacing),
          ...CSS_VALUES_NO_STRINGS
            .flatMap((value: string): TestCase => ({
              input: `color: var(--foo,${value});`,
              expected: `color: var(--a,${value});`,
            }))
            .flatMap(varyFunctionSpacing),
        ]
        .map(embedDeclarationsInStyle)
        .flatMap(embedAttributesInTags),
      },
      {
        name: "variables in multiple attributes",
        cases: [
          [
            {
              input: "style=\"--foo: red;\"",
              expected: "style=\"--a: red;\"",
            },
            {
              input: "style=\"--bar: blue;\"",
              expected: "style=\"--b: blue;\"",
            },
          ],
          [
            {
              input: "style=\"--foobar: serif;\"",
              expected: "style=\"--a: serif;\"",
            },
            {
              input: "style=\"--foobar: sans-serif\"",
              expected: "style=\"--a: sans-serif\"",
            },
          ],
          [
            {
              input: "style=\"--foo: red; --bar: blue;\"",
              expected: "style=\"--a: red; --b: blue;\"",
            },
            {
              input: "style=\"--foo: blue;\"",
              expected: "style=\"--a: blue;\"",
            },
          ],
          [
            {
              input: "style=\"--foo: red; --bar: blue;\"",
              expected: "style=\"--b: red; --a: blue;\"",
            },
            {
              input: "style=\"--bar: red;\"",
              expected: "style=\"--a: red;\"",
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
        name: "variable-like strings in non-CSS places",
        cases: [
          {
            input: "<div id=\"--foo\" style=\"--foo: red;\"></div>",
            expected: "<div id=\"--foo\" style=\"--a: red;\"></div>",
          },
          {
            input: "<div style=\"--foo: red;\" data-x=\"--foo: blue;\"></div>",
            expected: "<div style=\"--a: red;\" data-x=\"--foo: blue;\"></div>",
          },
          {
            input: "<!--foo bar--><div style=\"--foo: red;\"></div>",
            expected: "<!--foo bar--><div style=\"--a: red;\"></div>",
          },
          {
            input: "<div style=\"--foo: red\">--foo: blue;</div>",
            expected: "<div style=\"--a: red\">--foo: blue;</div>",
          },
        ],
      },
      {
        name: "edge cases",
        cases: [
          {
            input: "<div style></div>",
            expected: "<div style></div>",
            description: "style attribute without value should be ignored",
          },
          ...varyHtmlQuotes({
            input: "<div style=\"\"></div>",
            expected: "<div style=\"\"></div>",
            description: "style attribute with empty value should be ignored",
          }),
          {
            input: "<div style=\"--foo: red\"></div>",
            expected: "<div style=\"--a: red\"></div>",
            description: "it shouldn't be a problem if the `;` is missing",
          },
          {
            input: "<div style=\"color: var(--foo)\"></div>",
            expected: "<div style=\"color: var(--a)\"></div>",
            description: "it shouldn't be a problem if the `;` is missing",
          },
          {
            input: "<div style=\"--foo: red;\" style=\"--bar: blue;\"></div>",
            expected: "<div style=\"--a: red;\" style=\"--b: blue;\"></div>",
            description: "multiple style attributes on one element should all be mangled",
          },
          ...["data-", "x"]
            .map((prefix) => ({
              input: `<div ${prefix}style="--foo: red;"</div>`,
              expected: `<div ${prefix}style="--foo: red;"</div>`,
              description: "attributes with style-suffix should be ignored",
            })),
          {
            input: "<style id=\"foo\"></style>",
            expected: "<style id=\"foo\"></style>",
            description: "The \"style\" tag shouldn't cause problems",
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
            pattern: cssVarNamePattern,
            reserved: reservedCssVarNames,
            prefix: keepCssVarPrefix,
            description: failureMessage,
          } = testCase;

          const files = [new WebManglerFileMock("html", input)];

          const cssVariableMangler = new CssVariableMangler({
            cssVarNamePattern: cssVarNamePattern || DEFAULT_PATTERN,
            reservedCssVarNames: reservedCssVarNames,
            keepCssVarPrefix: keepCssVarPrefix,
          });

          const result = webmangler(files, {
            plugins: [cssVariableMangler],
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
        name: "sample",
        cases: [
          ...varyJsQuotes({
            input: "$el.style.getPropertyValue(\"--foobar\");",
            expected: "$el.style.getPropertyValue(\"--a\");",
          }),
          ...varySpacing("\"", {
            input: "$el.style.removeProperty(\"--foobar\");",
            expected: "$el.style.removeProperty(\"--a\");",
          }),
          ...varyJsQuotes({
            input: "var x = \"--foo\", setProperty(x, \"bar\");",
            expected: "var x = \"--a\", setProperty(x, \"bar\");",
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
            pattern: cssVarNamePattern,
            reserved: reservedCssVarNames,
            prefix: keepCssVarPrefix,
            description: failureMessage,
          } = testCase;

          const files = [new WebManglerFileMock("js", input)];

          const cssVariableMangler = new CssVariableMangler({
            cssVarNamePattern: cssVarNamePattern || DEFAULT_PATTERN,
            reservedCssVarNames: reservedCssVarNames,
            keepCssVarPrefix: keepCssVarPrefix,
          });

          const result = webmangler(files, {
            plugins: [cssVariableMangler],
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
    suite("::cssVarNamePattern", function() {
      const DEFAULT_PATTERNS = ["[a-zA-Z-]+"];

      test("default patterns", function() {
        const cssVariableMangler = new CssVariableMangler();
        const result = cssVariableMangler.options();
        expect(result).to.deep.include({ patterns: DEFAULT_PATTERNS });
      });

      test("custom pattern", function() {
        const pattern = "foo(bar|baz)-[a-z]+";

        const cssVariableMangler = new CssVariableMangler({
          cssVarNamePattern: pattern,
        });
        const result = cssVariableMangler.options();
        expect(result).to.deep.include({ patterns: pattern });
      });

      test("custom patterns", function() {
        const patterns: string[] = ["foobar-[a-z]+", "foobar-[0-9]+"];

        const cssVariableMangler = new CssVariableMangler({
          cssVarNamePattern: patterns,
        });
        const result = cssVariableMangler.options();
        expect(result).to.deep.include({ patterns: patterns });
      });
    });

    suite("::reservedCssVarNames", function() {
      test("default reserved", function() {
        const cssVariableMangler = new CssVariableMangler();
        const result = cssVariableMangler.options();
        expect(result).to.have.property("reservedNames").that.is.not.empty;
      });

      test("custom reserved", function() {
        const reserved: string[] = ["foo", "bar"];

        const cssVariableMangler = new CssVariableMangler({
          reservedCssVarNames: reserved,
        });
        const result = cssVariableMangler.options();
        expect(result).to.have.property("reservedNames");
        expect(result.reservedNames).to.include.members(reserved);
      });
    });

    suite("::keepCssVarPrefix", function() {
      const DEFAULT_MANGLE_PREFIX = "";

      test("default prefix", function() {
        const cssVariableMangler = new CssVariableMangler();
        const result = cssVariableMangler.options();
        expect(result).to.deep.include({ manglePrefix: DEFAULT_MANGLE_PREFIX });
      });

      test("custom prefix", function() {
        const prefix = "foobar";

        const cssVariableMangler = new CssVariableMangler({
          keepCssVarPrefix: prefix,
        });
        const result = cssVariableMangler.options();
        expect(result).to.deep.include({ manglePrefix: prefix });
      });
    });
  });

  suite("Illegal names", function() {
    const illegalNames: string[] = [
      "---", "--0", "--1", "--2", "--3", "--4", "--5", "--6", "--7", "--8",
      "--9",
    ];

    let content = "";

    suiteSetup(function() {
      const n = Array.from(ALL_CHARS).length;
      const nArray = getArrayOfFormattedStrings(n, "--%s:red");
      content = `:root { ${nArray.join(";")} `;
    });

    test("without extra reserved", function() {
      const files = [new WebManglerFileMock("css", content)];

      const cssVariableMangler = new CssVariableMangler({
        cssVarNamePattern: "[0-9]+",
      });

      const result = webmangler(files, {
        plugins: [cssVariableMangler],
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

      const cssVariableMangler = new CssVariableMangler({
        cssVarNamePattern: "[0-9]+",
        reservedCssVarNames: ["a"],
      });

      const result = webmangler(files, {
        plugins: [cssVariableMangler],
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
