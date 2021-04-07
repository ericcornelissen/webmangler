import type { TestScenario } from "@webmangler/testing";
import type { TestCase } from "./types";

import { WebManglerFileMock } from "@webmangler/testing";
import { expect } from "chai";

import {
  CSS_PROPERTIES,
  CSS_VALUES,
  CSS_VALUES_NO_STRINGS,
} from "./css-constants";
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
    const varyDeclarationSpacing = varySpacing(["\"", ":", ";"]);

    const scenarios: TestScenario<TestCase>[] = [
      {
        name: "variable declarations in style attribute",
        cases: [
          ...CSS_VALUES_NO_STRINGS
            .map((value) => ({
              input: `<div style="--foo:${value};"></div>`,
              expected: `<div style="--a:${value};"></div>`,
            }))
            .flatMap(varyDeclarationSpacing)
            .flatMap(varyHtmlQuotes),
        ],
      },
      {
        name: "variable declarations and other things in style attribute",
        cases: [
          {
            input: "<div style=\"color: blue; --foo: red;\"></div>",
            expected: "<div style=\"color: blue; --a: red;\"></div>",
          },
          {
            input: "<div style=\"--foo: red; font-size: 12px;\"></div>",
            expected: "<div style=\"--a: red; font-size: 12px;\"></div>",
          },
          {
            input: "<div style=\"color: blue; --foo: red; font-size: 12px;\"></div>",
            expected: "<div style=\"color: blue; --a: red; font-size: 12px;\"></div>",
          },
          {
            input: "<div style=\"--foo: red; --bar: blue;\"></div>",
            expected: "<div style=\"--a: red; --b: blue;\"></div>",
          },
          {
            input: "<div style=\"--foo: red; --foo: blue;\"></div>",
            expected: "<div style=\"--a: red; --a: blue;\"></div>",
          },
        ],
      },
      {
        name: "variable declarations in style attribute and other attributes",
        cases: [
          {
            input: "<div id=\"foo\" style=\"--bar: red;\"></div>",
            expected: "<div id=\"foo\" style=\"--a: red;\"></div>",
          },
          {
            input: "<div disabled style=\"--bar: red;\"></div>",
            expected: "<div disabled style=\"--a: red;\"></div>",
          },
          {
            input: "<div style=\"--foo: red;\" data-hello=\"world\"></div>",
            expected: "<div style=\"--a: red;\" data-hello=\"world\"></div>",
          },
          {
            input: "<div style=\"--foo: red;\" aria-hidden></div>",
            expected: "<div style=\"--a: red;\" aria-hidden></div>",
          },
          {
            input: "<div id=\"foo\" style=\"--bar: red;\" data-value=\"bar\"></div>",
            expected: "<div id=\"foo\" style=\"--a: red;\" data-value=\"bar\"></div>",
          },
          {
            input: "<div disabled style=\"--bar: red;\" data-value=\"bar\"></div>",
            expected: "<div disabled style=\"--a: red;\" data-value=\"bar\"></div>",
          },
          {
            input: "<div id=\"foo\" style=\"--bar: red;\" aria-hidden></div>",
            expected: "<div id=\"foo\" style=\"--a: red;\" aria-hidden></div>",
          },
          {
            input: "<div disabled style=\"--bar: red;\" aria-hidden></div>",
            expected: "<div disabled style=\"--a: red;\" aria-hidden></div>",
          },
        ],
      },
      {
        name: "variable usage in style attribute",
        cases: [
          ...CSS_PROPERTIES
            .map((property) => ({
              input: `<div style="${property}:var(--foo);"></div>`,
              expected: `<div style="${property}:var(--a);"></div>`,
            }))
            .flatMap(varyVariableUsageSpacing)
            .flatMap(varyHtmlQuotes),
        ],
      },
      {
        name: "variable usage and other things in style attribute",
        cases: [
          {
            input: "<div style=\"background: blue; color: var(--foo);\"></div>",
            expected: "<div style=\"background: blue; color: var(--a);\"></div>",
          },
          {
            input: "<div style=\"color: var(--foo); font-size: 12px;\"></div>",
            expected: "<div style=\"color: var(--a); font-size: 12px;\"></div>",
          },
          {
            input: "<div style=\"background: blue; color: var(--foo); font-size: 12px;\"></div>",
            expected: "<div style=\"background: blue; color: var(--a); font-size: 12px;\"></div>",
          },
          {
            input: "<div style=\"color: var(--foo); font: var(--bar);\"></div>",
            expected: "<div style=\"color: var(--a); font: var(--b);\"></div>",
          },
          {
            input: "<div style=\"color: var(--foo); font: var(--foo);\"></div>",
            expected: "<div style=\"color: var(--a); font: var(--a);\"></div>",
          },
        ],
      },
      {
        name: "variable usage in style attribute and other attributes",
        cases: [
          {
            input: "<div id=\"foo\" style=\"color: var(--bar);\"></div>",
            expected: "<div id=\"foo\" style=\"color: var(--a);\"></div>",
          },
          {
            input: "<div disabled style=\"color: var(--bar);\"></div>",
            expected: "<div disabled style=\"color: var(--a);\"></div>",
          },
          {
            input: "<div style=\"color: var(--foo);\" data-hello=\"world\"></div>",
            expected: "<div style=\"color: var(--a);\" data-hello=\"world\"></div>",
          },
          {
            input: "<div style=\"color: var(--foo);\" aria-hidden></div>",
            expected: "<div style=\"color: var(--a);\" aria-hidden></div>",
          },
          {
            input: "<div id=\"foo\" style=\"color: var(--bar);\" data-value=\"bar\"></div>",
            expected: "<div id=\"foo\" style=\"color: var(--a);\" data-value=\"bar\"></div>",
          },
          {
            input: "<div disabled style=\"color: var(--bar);\" data-value=\"bar\"></div>",
            expected: "<div disabled style=\"color: var(--a);\" data-value=\"bar\"></div>",
          },
          {
            input: "<div id=\"foo\" style=\"color: var(--bar);\" aria-hidden></div>",
            expected: "<div id=\"foo\" style=\"color: var(--a);\" aria-hidden></div>",
          },
          {
            input: "<div disabled style=\"color: var(--bar);\" aria-hidden></div>",
            expected: "<div disabled style=\"color: var(--a);\" aria-hidden></div>",
          },
        ],
      },
      {
        name: "variable usage with fallback in style attribute",
        cases: [
          ...CSS_VALUES_NO_STRINGS
            .map((value) => ({
              input: `<div style="color: var(--foo,${value});"></div>`,
              expected: `<div style="color: var(--a,${value});"></div>`,
            }))
            .flatMap(varyVariableUsageSpacing)
            .flatMap(varyHtmlQuotes),
        ],
      },
      {
        name: "non-style attributes matching the pattern",
        cases: [
          {
            input: "<div id=\"--foo: blue;\" style=\"--foo: red;\"></div>",
            expected: "<div id=\"--foo: blue;\" style=\"--a: red;\"></div>",
          },
          {
            input: "<div style=\"--foo: red;\" data-x=\"--foo: blue;\"></div>",
            expected: "<div style=\"--a: red;\" data-x=\"--foo: blue;\"></div>",
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
            input: "<div>--foo: red;</div>",
            expected: "<div>--foo: red;</div>",
            description: "anything inside tags matching the pattern should be ignored",
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
            description: "The tag \"style\" shouldn't cause problems",
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
