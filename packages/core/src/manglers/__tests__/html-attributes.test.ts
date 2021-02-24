import type { TestScenario } from "@webmangler/testing";
import type { TestCase } from "./types";

import { expect } from "chai";

import {
  PSEUDO_ELEMENT_SELECTORS,
  PSEUDO_SELECTORS,
  SELECTOR_COMBINATORS,
  TYPE_OR_UNITS ,
} from "./css-constants";
import {
  getArrayOfFormattedStrings,
  varyQuotes,
  varySpacing,
} from "./test-helpers";

import WebManglerFileMock from "../../__mocks__/mangler-file.mock";

import mangleEngine from "../../engine";
import BuiltInLanguageSupport from "../../languages/builtin";
import HtmlAttributeMangler from "../html-attributes";

const builtInLanguageSupport = new BuiltInLanguageSupport();

suite("HTML Attribute Mangler", function() {
  const DEFAULT_PATTERN = "data-[a-z-]+";

  suite("CSS", function() {
    const scenarios: TestScenario<TestCase>[] = [
      {
        name: "single attribute selector",
        cases: [
          ...varySpacing(["[", "]"], {
            input: "[data-foo] { }",
            expected: "[data-a] { }",
          }),
          ...varySpacing(["[", "]"], {
            input: "div[data-foo] { }",
            expected: "div[data-a] { }",
          }),
          ...varySpacing(["[", "]"], {
            input: "a[href] { }",
            expected: "a[href] { }",
          }),
        ],
      },
      {
        name: "multiple attribute selectors",
        cases: [
          ...SELECTOR_COMBINATORS.map((connector) => {
            return {
              input: `div[data-foo]${connector}div[data-bar] { }`,
              expected: `div[data-a]${connector}div[data-b] { }`,
            };
          }),
          {
            input: "div[data-foo] { } p[data-bar] { }",
            expected: "div[data-a] { } p[data-b] { }",
          },
          {
            input: "div[data-foo][data-bar] { }",
            expected: "div[data-a][data-b] { }",
          },
          {
            input: "div[data-foo][data-foo] { }",
            expected: "div[data-a][data-a] { }",
          },
          {
            input: "div[data-praise].foo[data-the]#bar[data-sun] { }",
            expected: "div[data-a].foo[data-b]#bar[data-c] { }",
          },
          {
            input: "div[data-foo] { } a[href] { }",
            expected: "div[data-a] { } a[href] { }",
          },
          {
            input: "a[href] { } div[data-foo] { }",
            expected: "a[href] { } div[data-a] { }",
          },
        ],
      },
      {
        name: "attribute value selector",
        cases: [
          ...varyQuotes("css", {
            input: "[data-foo=\"bar\"] { }",
            expected: "[data-a=\"bar\"] { }",
          }),
          ...varySpacing(["[", "]"], {
            input: "[data-foo=\"bar\"] { }",
            expected: "[data-a=\"bar\"] { }",
          }),
          ...varySpacing("=", {
            input: "[data-foo=\"bar\"] { }",
            expected: "[data-a=\"bar\"] { }",
          }),
          ...varySpacing("|=", {
            input: "[data-foo|=\"bar\"] { }",
            expected: "[data-a|=\"bar\"] { }",
          }),
          ...varySpacing("~=", {
            input: "[data-foo~=\"bar\"] { }",
            expected: "[data-a~=\"bar\"] { }",
          }),
          ...varySpacing("^=", {
            input: "[data-foo^=\"bar\"] { }",
            expected: "[data-a^=\"bar\"] { }",
          }),
          ...varySpacing("$=", {
            input: "[data-foo$=\"bar\"] { }",
            expected: "[data-a$=\"bar\"] { }",
          }),
          ...varySpacing("*=", {
            input: "[data-foo*=\"bar\"] { }",
            expected: "[data-a*=\"bar\"] { }",
          }),
        ],
      },
      {
        name: "attribute selectors with pseudo selectors",
        cases: [
          ...PSEUDO_SELECTORS.map((s: string): TestCase => ({
            input: `[data-foo]:${s} { }`,
            expected: `[data-a]:${s} { }`,
          })),
          ...PSEUDO_ELEMENT_SELECTORS.map((s: string): TestCase => ({
            input: `[data-foo]::${s} { }`,
            expected: `[data-a]::${s} { }`,
          })),
        ],
      },
      {
        name: "inverted attribute selectors",
        cases: [
          ...varySpacing(["(", ")"], {
            input: ":not([data-foo]) { }",
            expected: ":not([data-a]) { }",
          }),
        ],
      },
      {
        name: "attribute usage",
        cases: [
          ...varySpacing(["(", ")"], {
            input: "div { content: attr(data-foo); }",
            expected: "div { content: attr(data-a); }",
          }),
          ...varySpacing(["(", ")"], {
            input: `div { content: attr(data-foo ${TYPE_OR_UNITS[0]}); }`,
            expected: `div { content: attr(data-a ${TYPE_OR_UNITS[0]}); }`,
          }),
          ...TYPE_OR_UNITS.map((typeOrUnit) => {
            return {
              input: `div { content: attr(data-foo ${typeOrUnit}); }`,
              expected: `div { content: attr(data-a ${typeOrUnit}); }`,
            };
          }),
          ...varyQuotes("css", {
            input: "div { content: attr(data-foo, \"bar\"); }",
            expected: "div { content: attr(data-a, \"bar\"); }",
          }),
          ...varySpacing(["(", ")"], {
            input: "div { content: attr(data-foo, \"bar\"); }",
            expected: "div { content: attr(data-a, \"bar\"); }",
          }),
          ...varySpacing([","], {
            input: "div { content: attr(data-foo,\"bar\"); }",
            expected: "div { content: attr(data-a,\"bar\"); }",
          }),
        ],
      },
      {
        name: "edge cases",
        cases: [
          {
            input: "[data-foo=\"]\"] { }",
            expected: "[data-a=\"]\"] { }",
          },
          {
            input: "[data-foo=\"[\"] { }",
            expected: "[data-a=\"[\"] { }",
          },
          {
            input: "[data-foo=\"=\"] { }",
            expected: "[data-a=\"=\"] { }",
          },
          {
            input: "#data-foo[data-foo] { }",
            expected: "#data-foo[data-a] { }",
          },
          {
            input: "#data-foo { }",
            expected: "#data-foo { }",
          },
          {
            input: ".data-foo { }",
            expected: ".data-foo { }",
          },
          {
            input: ".data-foo[data-foo] { }",
            expected: ".data-foo[data-a] { }",
          },
          {
            input: "div { }",
            expected: "div { }",
            pattern: "[a-z]+",
          },
          {
            input: "div[class] { }",
            expected: "div[data-a] { }",
            pattern: "[a-z]+",
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

          const htmlAttributeMangler = new HtmlAttributeMangler({
            attrNamePattern: attrNamePattern || DEFAULT_PATTERN,
            reservedAttrNames: reservedAttrNames,
            keepAttrPrefix: keepAttrPrefix,
          });
          const expressions = builtInLanguageSupport.getExpressions(HtmlAttributeMangler._ID);

          const files = [new WebManglerFileMock("css", input)];
          const options = htmlAttributeMangler.config();
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
        name: "single attribute",
        cases: [
          ...varySpacing("=", {
            input: "<div data-foo=\"bar\"></div>",
            expected: "<div data-a=\"bar\"></div>",
          }),
          ...varyQuotes("html", {
            input: "<div data-foo=\"bar\"></div>",
            expected: "<div data-a=\"bar\"></div>",
          }),
          ...varySpacing(">", {
            input: "<div data-foo></div>",
            expected: "<div data-a></div>",
          }),
        ],
      },
      {
        name: "multiple attributes",
        cases: [
          ...varyQuotes("html", {
            input: "<div id=\"foo\" data-foo=\"bar\"></div>",
            expected: "<div id=\"foo\" data-a=\"bar\"></div>",
          }),
          ...varyQuotes("html", {
            input: "<div data-foo=\"foo\" class=\"bar\"></div>",
            expected: "<div data-a=\"foo\" class=\"bar\"></div>",
          }),
          ...varyQuotes("html", {
            input: "<div id=\"praise\" data-foo=\"the\" class=\"sun\"></div>",
            expected: "<div id=\"praise\" data-a=\"the\" class=\"sun\"></div>",
          }),
          ...varyQuotes("html", {
            input: "<div id=\"foo\"><div data-foo=\"bar\"></div></div>",
            expected: "<div id=\"foo\"><div data-a=\"bar\"></div></div>",
          }),
          ...varyQuotes("html", {
            input: "<div data-foo=\"bar\"><div id=\"foo\"></div></div>",
            expected: "<div data-a=\"bar\"><div id=\"foo\"></div></div>",
          }),
          ...varyQuotes("html", {
            input: "<div data-foo=\"bar\"><div data-bar=\"foo\"></div></div>",
            expected: "<div data-a=\"bar\"><div data-b=\"foo\"></div></div>",
          }),
          ...varySpacing("=", {
            input: "<div data-foo=\"bar\"><div data-bar=\"foo\"></div></div>",
            expected: "<div data-a=\"bar\"><div data-b=\"foo\"></div></div>",
          }),
          ...varyQuotes("html", {
            input: "<div data-foo=\"bar\" data-bar=\"foo\"></div>",
            expected: "<div data-a=\"bar\" data-b=\"foo\"></div>",
          }),
          ...varySpacing("=", {
            input: "<div data-foo=\"bar\" data-bar=\"foo\"></div>",
            expected: "<div data-a=\"bar\" data-b=\"foo\"></div>",
          }),
          {
            input: "<a href=\"https://www.example.com/\" data-foo></a>",
            expected: "<a href=\"https://www.example.com/\" data-a></a>",
          },
          {
            input: "<a data-foo href=\"https://www.example.com/\"></a>",
            expected: "<a data-a href=\"https://www.example.com/\"></a>",
          },
        ],
      },
      {
        name: "input attributes and mangled attributes intersect",
        cases: [
          {
            input: "<div data-a></div>",
            pattern: "data-[a-z]",
            expected: "<div data-a></div>",
          },
          {
            input: "<div data-b data-a></div>",
            pattern: "data-[a-z]",
            expected: "<div data-a data-b></div>",
          },
          {
            input: "<div data-a data-c data-b></div>",
            pattern: "data-[a-z]",
            expected: "<div data-a data-b data-c></div>",
          },
          {
            input: "<div data-d data-b data-c data-a></div>",
            pattern: "data-[a-z]",
            expected: "<div data-a data-b data-c data-d></div>",
          },
          {
            input: "<div data-d data-a data-b data-c data-b></div>",
            pattern: "data-[a-z]",
            expected: "<div data-b data-c data-a data-d data-a></div>",
          },
          {
            input: "<div data-o data-m data-foo data-n></div>",
            pattern: "data-[a-z]",
            expected: "<div data-a data-b data-foo data-c></div>",
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
            input: "<div data-foo=\"bar\" data-foo=\"baz\"></div>",
            expected: "<div data-a=\"bar\" data-a=\"baz\"></div>",
            description: "Repeated attributes should all be mangled consistently",
          },
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
          {
            input: "< div data-foo=\"bar\"></div>",
            expected: "< div data-a=\"bar\"></div>",
            description: "ignore spacing before opening tag",
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

          const htmlAttributeMangler = new HtmlAttributeMangler({
            attrNamePattern: attrNamePattern || DEFAULT_PATTERN,
            reservedAttrNames: reservedAttrNames,
            keepAttrPrefix: keepAttrPrefix,
          });
          const expressions = builtInLanguageSupport.getExpressions(HtmlAttributeMangler._ID);

          const files = [new WebManglerFileMock("html", input)];
          const options = htmlAttributeMangler.config();
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
        name: "single attribute selectors",
        cases: [
          ...varyQuotes("js", {
            input: "document.querySelectorAll(\"[data-foo]\");",
            expected: "document.querySelectorAll(\"[data-a]\");",
          }),
          ...varyQuotes("js", {
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
              input: `"[data-foo]${connector}data[data-bar]"`,
              expected: `"[data-a]${connector}data[data-b]"`,
            };
          }),
          ...varyQuotes("js", {
            input: "document.querySelectorAll(\"a[href] span[data-foobar]\");",
            expected: "document.querySelectorAll(\"a[href] span[data-a]\");",
          }),
          ...varySpacing(["[", "]"], {
            input: "document.querySelectorAll(\"span[data-foobar] a[href]\");",
            expected: "document.querySelectorAll(\"span[data-a] a[href]\");",
          }),
          ...varyQuotes("js", {
            input: "document.querySelectorAll(\"p[data-foo] b[data-bar]\");",
            expected: "document.querySelectorAll(\"p[data-a] b[data-b]\");",
          }),
          ...varyQuotes("js", {
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
          ...varyQuotes("js", {
            input: "var s = \"[data-foo=\\\"bar\\\"]\";",
            expected: "var s = \"[data-a=\\\"bar\\\"]\";",
          }),
          ...varyQuotes("js", {
            input: "var s = \"[data-foo|=\\\"bar\\\"]\";",
            expected: "var s = \"[data-a|=\\\"bar\\\"]\";",
          }),
          ...varyQuotes("js", {
            input: "var s = \"[data-foo~=\\\"bar\\\"]\";",
            expected: "var s = \"[data-a~=\\\"bar\\\"]\";",
          }),
          ...varyQuotes("js", {
            input: "var s = \"[data-foo^=\\\"bar\\\"]\";",
            expected: "var s = \"[data-a^=\\\"bar\\\"]\";",
          }),
          ...varyQuotes("js", {
            input: "var s = \"[data-foo$=\\\"bar\\\"]\";",
            expected: "var s = \"[data-a$=\\\"bar\\\"]\";",
          }),
          ...varyQuotes("js", {
            input: "var s = \"[data-foo*=\\\"bar\\\"]\";",
            expected: "var s = \"[data-a*=\\\"bar\\\"]\";",
          }),
          ...varyQuotes("js", {
            input: "var s = \"[data-foo=\\\"bar\\\"][data-bar=\\\"foo\\\"]\";",
            expected: "var s = \"[data-a=\\\"bar\\\"][data-b=\\\"foo\\\"]\";",
          }),
        ],
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
          ...varyQuotes("js", {
            input: "$el.getAttribute(\"data-foo\");",
            expected: "$el.getAttribute(\"data-a\");",
          }),
          ...varySpacing("\"", {
            input: "$el.removeAttribute(\"data-bar\");",
            expected: "$el.removeAttribute(\"data-a\");",
          }),
          ...varyQuotes("js", {
            input: "let attr = \"data-foo\"; $el.setAttribute(attr, \"bar\");",
            expected: "let attr = \"data-a\"; $el.setAttribute(attr, \"bar\");",
          }),
        ],
      },
      {
        name: "input attributes and mangled attributes intersect",
        cases: [
          {
            input: "querySelector(\"[data-a]\");",
            pattern: "data-[a-z]",
            expected: "querySelector(\"[data-a]\");",
          },
          {
            input: "querySelector(\"[data-b][data-a]\");",
            pattern: "data-[a-z]",
            expected: "querySelector(\"[data-a][data-b]\");",
          },
          {
            input: "querySelector(\"[data-a][data-c][data-b]\");",
            pattern: "data-[a-z]",
            expected: "querySelector(\"[data-a][data-b][data-c]\");",
          },
          {
            input: "var selector = \"[data-d][data-b][data-c][data-a]\";",
            pattern: "data-[a-z]",
            expected: "var selector = \"[data-a][data-b][data-c][data-d]\";",
          },
          {
            input: "var s = \"[data-d][data-a][data-b][data-c][data-b]\";",
            pattern: "data-[a-z]",
            expected: "var s = \"[data-b][data-c][data-a][data-d][data-a]\";",
          },
          {
            input: "var selector = \"[data-o][data-m][data-foo][data-n]\";",
            pattern: "data-[a-z]",
            expected: "var selector = \"[data-a][data-b][data-foo][data-c]\";",
          },
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

          const htmlAttributeMangler = new HtmlAttributeMangler({
            attrNamePattern: attrNamePattern || DEFAULT_PATTERN,
            reservedAttrNames: reservedAttrNames,
            keepAttrPrefix: keepAttrPrefix,
          });
          const expressions = builtInLanguageSupport.getExpressions(HtmlAttributeMangler._ID);

          const files = [new WebManglerFileMock("js", input)];
          const options = htmlAttributeMangler.config();
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
      const expected = HtmlAttributeMangler.DEFAULT_PATTERNS;

      const cssClassMangler = new HtmlAttributeMangler();
      const result = cssClassMangler.config();
      expect(result).to.deep.include({ patterns: expected });
    });

    test("custom pattern", function() {
      const pattern = "foo(bar|baz)-[a-z]+";

      const cssClassMangler = new HtmlAttributeMangler({ attrNamePattern: pattern });
      const result = cssClassMangler.config();
      expect(result).to.deep.include({ patterns: pattern });
    });

    test("custom patterns", function() {
      const patterns: string[] = ["foobar-[a-z]+", "foobaz-[a-z]+"];

      const cssClassMangler = new HtmlAttributeMangler({ attrNamePattern: patterns });
      const result = cssClassMangler.config();
      expect(result).to.deep.include({ patterns: patterns });
    });

    test("default reserved", function() {
      const expected = HtmlAttributeMangler.ALWAYS_RESERVED.concat(HtmlAttributeMangler.DEFAULT_RESERVED);

      const cssClassMangler = new HtmlAttributeMangler();
      const result = cssClassMangler.config();
      expect(result).to.deep.include({ reservedNames: expected });
    });

    test("custom reserved", function() {
      const reserved: string[] = ["foo", "bar"];
      const expected = HtmlAttributeMangler.ALWAYS_RESERVED.concat(reserved);

      const cssClassMangler = new HtmlAttributeMangler({ reservedAttrNames: reserved });
      const result = cssClassMangler.config();
      expect(result).to.deep.include({ reservedNames: expected });
    });

    test("default prefix", function() {
      const expected = HtmlAttributeMangler.DEFAULT_PREFIX;

      const cssClassMangler = new HtmlAttributeMangler();
      const result = cssClassMangler.config();
      expect(result).to.deep.include({ manglePrefix: expected });
    });

    test("custom prefix", function() {
      const prefix = "foobar";

      const cssClassMangler = new HtmlAttributeMangler({ keepAttrPrefix: prefix });
      const result = cssClassMangler.config();
      expect(result).to.deep.include({ manglePrefix: prefix });
    });
  });

  suite("Illegal names", function() {
    const illegalNames: string[] = [
      " -", " _", " 1", " 2", " 3", " 4", " 5", " 6", " 7", " 8", " 9",
    ];

    let content = "";

    suiteSetup(function() {
      const n = HtmlAttributeMangler.CHARACTER_SET.length;
      const nArray = getArrayOfFormattedStrings(n, "<div data-%s=\"foo\">");
      content = nArray.join("");
    });

    test("without extra reserved", function() {
      const htmlAttributeMangler = new HtmlAttributeMangler({
        attrNamePattern: "data-[0-9]+",
        keepAttrPrefix: "",
      });
      const expressions = builtInLanguageSupport.getExpressions(HtmlAttributeMangler._ID);

      const files = [new WebManglerFileMock("html", content)];
      const options = htmlAttributeMangler.config();
      const result = mangleEngine(files, expressions, options);
      expect(result).to.have.lengthOf(1);

      const out = result[0];
      for (const illegalName of illegalNames) {
        expect(out.content).not.to.have.string(illegalName);
      }
    });

    test("with extra reserved", function() {
      const htmlAttributeMangler = new HtmlAttributeMangler({
        attrNamePattern: "data-[0-9]+",
        reservedAttrNames: ["a"],
        keepAttrPrefix: "",
      });
      const expressions = builtInLanguageSupport.getExpressions(HtmlAttributeMangler._ID);

      const files = [new WebManglerFileMock("html", content)];
      const options = htmlAttributeMangler.config();
      const result = mangleEngine(files, expressions, options);
      expect(result).to.have.lengthOf(1);

      const out = result[0];
      for (const illegalName of illegalNames) {
        expect(out.content).not.to.have.string(illegalName);
      }
    });
  });
});
