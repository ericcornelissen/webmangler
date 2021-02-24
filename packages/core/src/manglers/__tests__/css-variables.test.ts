import type { TestScenario } from "@webmangler/testing";
import type { TestCase } from "./types";

import { expect } from "chai";

import {
  getArrayOfFormattedStrings,
  varyQuotes,
  varySpacing,
} from "./test-helpers";

import WebManglerFileMock from "../../__mocks__/web-mangler-file.mock";

import BuiltInLanguageSupport from "../../languages/builtin";
import mangleEngine from "../../engine";
import CssVariableMangler from "../css-variables";

const builtInLanguageSupport = new BuiltInLanguageSupport();

const DEFAULT_PATTERN = "[a-z-]+";
const CSS_PROPERTIES = [
  "background",
  "color",
  "font",
];
const CSS_VALUES_WITHOUT_QUOTES: string[] = [
  "#000",
  "#ABCDEF",
  "12px",
  "black",
  "serif",
];
const CSS_VALUES: string[] = CSS_VALUES_WITHOUT_QUOTES.concat([
  "\"foo\"",
  "'bar'",
]);

suite("CSS Variable Mangler", function() {
  suite("CSS", function() {
    const scenarios: TestScenario<TestCase>[] = [
      {
        name: "variable declarations",
        cases: [
          ...CSS_VALUES
            .map((value): TestCase => ({
              input: `:root{--foo:${value};}`,
              expected: `:root{--a:${value};}`,
            }))
            .map((testCase) => varySpacing(["{", ":", ";", "}"], testCase))
            .flat(),
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
        name: "variable usage",
        cases: [
          ...varySpacing(["(", ")"], {
            input: "div { color: var(--foo); }",
            expected: "div { color: var(--a); }",
          }),
          ...varySpacing(["(", ")"], {
            input: "div { background: purple; color: var(--foo); }",
            expected: "div { background: purple; color: var(--a); }",
          }),
          ...varySpacing(["(", ")"], {
            input: "div { color: var(--foo); font-size: 12px; }",
            expected: "div { color: var(--a); font-size: 12px; }",
          }),
          ...varySpacing(["(", ")"], {
            input: "div { background: purple; color: var(--foo); font-size: 12px; }",
            expected: "div { background: purple; color: var(--a); font-size: 12px; }",
          }),
          ...varySpacing(["(", ")"], {
            input: "div { color: var(--foo); font: var(--bar); }",
            expected: "div { color: var(--a); font: var(--b); }",
          }),
          ...varySpacing(["(", ")"], {
            input: "div { color: var(--foo); } p { font: var(--bar); }",
            expected: "div { color: var(--a); } p { font: var(--b); }",
          }),
        ],
      },
      {
        name: "variable usage with fallback",
        cases: [
          ...CSS_VALUES
            .map((value) => ({
              input: `div { color: var(--foo,${value}); }`,
              expected: `div { color: var(--a,${value}); }`,
            }))
            .map((testCase) => varySpacing(["(", ",", ")"], testCase))
            .flat(),
        ],
      },
      {
        name: "variable declarations & usage",
        cases: [
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
        name: "edge cases",
        cases: [
          {
            input: ":root { --foo: 'bar' }",
            expected: ":root { --a: 'bar' }",
            description: "It shouldn't be a problem if the `;` is missing",
          },
          {
            input: ":root { color: var(--foo) }",
            expected: ":root { color: var(--a) }",
            description: "It shouldn't be a problem if the `;` is missing",
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

          const cssVariableMangler = new CssVariableMangler({
            cssVarNamePattern: cssVarNamePattern || DEFAULT_PATTERN,
            reservedCssVarNames: reservedCssVarNames,
            keepCssVarPrefix: keepCssVarPrefix,
          });
          const expressions = builtInLanguageSupport.getExpressions(CssVariableMangler._ID);

          const files = [new WebManglerFileMock("css", input)];
          const options = cssVariableMangler.config();
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
        name: "variable declarations in style attribute",
        cases: [
          ...CSS_VALUES_WITHOUT_QUOTES
            .map((value) => ({
              input: `<div style="--foo:${value};"></div>`,
              expected: `<div style="--a:${value};"></div>`,
            }))
            .map((testCase) => varySpacing(["\"", ":", ";"], testCase))
            .flat()
            .map((testCase) => varyQuotes("html", testCase))
            .flat(),
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
            .map((testCase) => varySpacing([":", "(", ")"], testCase))
            .flat()
            .map((testCase) => varyQuotes("html", testCase))
            .flat(),
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
          ...CSS_VALUES_WITHOUT_QUOTES
            .map((value) => ({
              input: `<div style="color: var(--foo,${value});"></div>`,
              expected: `<div style="color: var(--a,${value});"></div>`,
            }))
            .map((testCase) => varySpacing(["(", ",", ")"], testCase))
            .flat()
            .map((testCase) => varyQuotes("html", testCase))
            .flat(),
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
          ...varyQuotes("html", {
            input: "<div style=\"\"></div>",
            expected: "<div style=\"\"></div>",
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
            description: "multiple class attributes on one element should all be mangled",
          },
          ...["data-", "x"]
            .map((prefix) => ({
              input: `<div ${prefix}style="--foo: red;"</div>`,
              expected: `<div ${prefix}style="--foo: red;"</div>`,
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

          const cssVariableMangler = new CssVariableMangler({
            cssVarNamePattern: cssVarNamePattern || DEFAULT_PATTERN,
            reservedCssVarNames: reservedCssVarNames,
            keepCssVarPrefix: keepCssVarPrefix,
          });
          const expressions = builtInLanguageSupport.getExpressions(CssVariableMangler._ID);

          const files = [new WebManglerFileMock("html", input)];
          const options = cssVariableMangler.config();
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
        name: "sample",
        cases: [
          ...varyQuotes("js", {
            input: "$el.style.getPropertyValue(\"--foobar\");",
            expected: "$el.style.getPropertyValue(\"--a\");",
          }),
          ...varySpacing("\"", {
            input: "$el.style.removeProperty(\"--foobar\");",
            expected: "$el.style.removeProperty(\"--a\");",
          }),
          ...varyQuotes("js", {
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

          const cssVariableMangler = new CssVariableMangler({
            cssVarNamePattern: cssVarNamePattern || DEFAULT_PATTERN,
            reservedCssVarNames: reservedCssVarNames,
            keepCssVarPrefix: keepCssVarPrefix,
          });
          const expressions = builtInLanguageSupport.getExpressions(CssVariableMangler._ID);

          const files = [new WebManglerFileMock("js", input)];
          const options = cssVariableMangler.config();
          const result = mangleEngine(files, expressions, options);
          expect(result).to.have.length(1);

          const out = result[0];
          expect(out.content).to.equal(expected, failureMessage);
        }
      });
    }
  });

  suite("Configuration", function() {
    test("default patterns", function() {
      const expected = CssVariableMangler.DEFAULT_PATTERNS;

      const cssClassMangler = new CssVariableMangler();
      const result = cssClassMangler.config();
      expect(result).to.deep.include({ patterns: expected });
    });

    test("custom pattern", function() {
      const pattern = "foo(bar|baz)-[a-z]+";

      const cssClassMangler = new CssVariableMangler({ cssVarNamePattern: pattern });
      const result = cssClassMangler.config();
      expect(result).to.deep.include({ patterns: pattern });
    });

    test("custom patterns", function() {
      const patterns: string[] = ["foobar-[a-z]+", "foobaz-[a-z]+"];

      const cssClassMangler = new CssVariableMangler({ cssVarNamePattern: patterns });
      const result = cssClassMangler.config();
      expect(result).to.deep.include({ patterns: patterns });
    });

    test("default reserved", function() {
      const expected = CssVariableMangler.ALWAYS_RESERVED.concat(CssVariableMangler.DEFAULT_RESERVED);

      const cssClassMangler = new CssVariableMangler();
      const result = cssClassMangler.config();
      expect(result).to.deep.include({ reservedNames: expected });
    });

    test("custom reserved", function() {
      const reserved: string[] = ["foo", "bar"];
      const expected = CssVariableMangler.ALWAYS_RESERVED.concat(reserved);

      const cssClassMangler = new CssVariableMangler({ reservedCssVarNames: reserved });
      const result = cssClassMangler.config();
      expect(result).to.deep.include({ reservedNames: expected });
    });

    test("default prefix", function() {
      const expected = CssVariableMangler.DEFAULT_PREFIX;

      const cssClassMangler = new CssVariableMangler();
      const result = cssClassMangler.config();
      expect(result).to.deep.include({ manglePrefix: expected });
    });

    test("custom prefix", function() {
      const prefix = "foobar";

      const cssClassMangler = new CssVariableMangler({ keepCssVarPrefix: prefix });
      const result = cssClassMangler.config();
      expect(result).to.deep.include({ manglePrefix: prefix });
    });
  });

  suite("Illegal names", function() {
    const illegalNames: string[] = [
      "---", "--0", "--1", "--2", "--3", "--4", "--5", "--6", "--7", "--8",
      "--9",
    ];

    let content = "";

    suiteSetup(function() {
      const n = CssVariableMangler.CHARACTER_SET.length;
      const nArray = getArrayOfFormattedStrings(n, "--%s:red");
      content = `:root { ${nArray.join(";")} `;
    });

    test("without extra reserved", function() {
      const cssVariableMangler = new CssVariableMangler({
        cssVarNamePattern: "[0-9]+",
      });
      const expressions = builtInLanguageSupport.getExpressions(CssVariableMangler._ID);

      const files = [new WebManglerFileMock("css", content)];
      const options = cssVariableMangler.config();
      const result = mangleEngine(files, expressions, options);
      expect(result).to.have.lengthOf(1);

      const out = result[0];
      for (const illegalName of illegalNames) {
        expect(out.content).not.to.have.string(illegalName);
      }
    });

    test("with extra reserved", function() {
      const cssVariableMangler = new CssVariableMangler({
        cssVarNamePattern: "[0-9]+",
        reservedCssVarNames: ["a"],
      });
      const expressions = builtInLanguageSupport.getExpressions(CssVariableMangler._ID);

      const files = [new WebManglerFileMock("css", content)];
      const options = cssVariableMangler.config();
      const result = mangleEngine(files, expressions, options);
      expect(result).to.have.lengthOf(1);

      const out = result[0];
      for (const illegalName of illegalNames) {
        expect(out.content).not.to.have.string(illegalName);
      }
    });
  });
});
