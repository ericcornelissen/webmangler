import type { TestScenario } from "@webmangler/testing";
import type { TestCase } from "./types";

import { WebManglerFileMock } from "@webmangler/testing";
import { expect } from "chai";
import * as R from "ramda";

import {
  CSS_PROPERTIES,
  CSS_VALUES,
  CSS_VALUES_NO_STRINGS,
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

    run("css", scenarios);
  });

  suite.only("HTML - style attribute", function() {
    const embedDeclarationsInStyle = embedAttributeValue("style");

    const varyAttributeSpacing = varySpacing("=");
    const varyDeclarationSpacing = varySpacing([":", ",", ";"]);
    const varyTagSpacing = varySpacing(["<", ">"]);

    type TestInstance = {
      readonly name: string;
      factory(before: string, after: string): TestCase[];
    }

    const instances: TestInstance[] = [
      {
        name: "variable declaration",
        factory: (before: string, after: string): TestCase[] => [
          ...CSS_VALUES_NO_STRINGS
            .map((value: string): TestCase => ({
              input: `--${before}:${value};`,
              expected: `--${after}:${value};`,
            })),
        ],
      },
      {
        name: "variable usage without default",
        factory: (before: string, after: string): TestCase[] => [
          ...CSS_PROPERTIES
            .map((property: string): TestCase => ({
              input: `${property}:var(--${before});`,
              expected: `${property}:var(--${after});`,
            })),
        ],
      },
      {
        name: "variable usage with default",
        factory: (before: string, after: string): TestCase[] => [
          ...CSS_PROPERTIES
            .map((property: string): TestCase => ({
              input: `${property}:var(--${before},42);`,
              expected: `${property}:var(--${after},42);`,
            })),
        ],
      },
      {
        name: "variable usage with default",
        factory: (before: string, after: string): TestCase[] => [
          ...CSS_VALUES_NO_STRINGS
            .map((value: string): TestCase => ({
              input: `content:var(--${before},${value});`,
              expected: `content:var(--${after},${value});`,
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
            .filter((testCase) => !/(\s|^)(style)=/.test(testCase.input)),
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
        name: "variable-like strings in non-CSS places",
        cases: [
          {
            input: "<!--foo bar-->",
            expected: "<!--foo bar-->",
          },
          {
            input: "<!--foo bar--><div style=\"--foo:red;\"></div>",
            expected: "<!--foo bar--><div style=\"--a:red;\"></div>",
          },
        ],
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
        [factory("foo", "a"), factory("bar", "b")],
        [factory("foobar", "a"), factory("foobar", "a")],
      ].flatMap(([testCasesA, testCasesB]): [TestCase, TestCase][] => {
        return R.zip(
          testCasesA.map(embedDeclarationsInStyle),
          testCasesB.map(embedDeclarationsInStyle),
        );
      });

      scenarios.push(...[
        {
          name: `no matching ${name} in a style attribute`,
          cases: factory("-foobar", "-foobar")
            .map(embedDeclarationsInStyle)
            .flatMap(varyHtmlQuotes)
            .flatMap(embedAttributesInTags),
        },
        {
          name: `${name} by itself in a style attribute`,
          cases: factory("foobar", "a")
            .map(embedDeclarationsInStyle)
            .flatMap(varyAttributeSpacing)
            .flatMap(varyHtmlQuotes)
            .flatMap(embedAttributesInTags),
        },
        {
          name: `${name}, vary spacing`,
          cases: factory("foobar", "a")
            .map(embedDeclarationsInStyle)
            .flatMap(varyDeclarationSpacing)
            .flatMap(embedAttributesInTags),
        },
        {
          name: `${name} in an unquoted style attribute`,
          cases: factory("foobar", "a")
            .map(embedDeclarationsInStyle)
            .map((testCase: TestCase): TestCase => ({
              input: testCase.input.replace(/"/g, ""),
              expected: testCase.expected.replace(/"/g, ""),
            }))
            .flatMap(varyAttributeSpacing)
            .flatMap(embedAttributesInTags),
        },
        {
          name: `${name} by itself in a style attribute with other attributes`,
          cases: factory("foobar", "a")
            .map(embedDeclarationsInStyle)
            .flatMap(embedWithOtherAttributes)
            .flatMap(embedAttributesInTags),
        },
        {
          name: `${name} with other declarations in a style attribute`,
          cases: factory("foobar", "a")
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
          cases: factory("foobar", "a")
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
          cases: factory("foobar", "a")
            .flatMap((testCase: TestCase): TestCase[] => [
              ...HTML_ATTRIBUTES
                .filter((attribute: string) => !/^(style)$/.test(attribute))
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
              ...["x", "data-"]
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
          name: `${name} with non-closing ">"`,
          cases: factory("foobar", "a")
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
            ...factory("foobar", "a")
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
          cases: factory("foobar", "a")
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
          cases: factory("foobar", "a")
            .map((testCase: TestCase): TestCase => ({
              input: testCase.input.replace(";", ""),
              expected: testCase.expected.replace(";", ""),
              description: "missing \";\" should not matter",
            }))
            .map(embedDeclarationsInStyle)
            .flatMap(embedAttributesInTags),
        },
      ]);
    }

    run("html", scenarios);
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

    run("js", scenarios);
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
          pattern: cssVarNamePattern,
          reserved: reservedCssVarNames,
          prefix: keepCssVarPrefix,
          description: failureMessage,
        } = testCase;

        const files = [new WebManglerFileMock(language, input)];

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
}
