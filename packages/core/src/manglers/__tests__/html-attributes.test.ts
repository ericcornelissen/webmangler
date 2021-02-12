import type { TestScenario } from "@webmangler/testing";
import type { TestCase } from "./types";

import { expect } from "chai";

import { TYPE_OR_UNITS } from "./css-selectors";
import {
  getArrayOfFormattedStrings,
  varyQuotes,
  varySpacing,
} from "./test-helpers";

import ManglerFileMock from "../../__mocks__/mangler-file.mock";

import mangleEngine from "../../engine";
import BuiltInLanguageSupport from "../../languages/builtin";
import HtmlAttributeMangler from "../html-attributes";

const builtInLanguageSupport = new BuiltInLanguageSupport();

suite("HTML Attribute Mangler", function() {
  const DEFAULT_PATTERN = "data-[a-z-]+";

  suite("CSS", function() {
    const scenarios: TestScenario<TestCase>[] = [
      {
        name: "attribute selector",
        cases: [
          ...varySpacing(["[", "]"], {
            input: "[data-foo] { }",
            expected: "[data-a] { }",
          }),
          ...varySpacing("[", {
            input: "div[data-foo] { }",
            expected: "div[data-a] { }",
          }),
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
          ...varySpacing("|=", {
            input: "[data-foo|=\"bar\"] { }",
            expected: "[data-a|=\"bar\"] { }",
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
        name: "prefix",
        cases: [
          {
            input: "[data-foo] { }",
            expected: "[a] { }",
            prefix: "",
          },
        ],
      },
      {
        name: "non-attribute selectors matching pattern",
        cases: [
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
          htmlAttributeMangler.use(builtInLanguageSupport);

          const files = [new ManglerFileMock("css", input)];
          const result = htmlAttributeMangler.mangle(mangleEngine, files);
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
        name: "sample",
        cases: [
          ...varySpacing("=", {
            input: "<div data-foo=\"bar\"></div>",
            expected: "<div data-a=\"bar\"></div>",
          }),
          ...varyQuotes("html", {
            input: "<div data-foo=\"bar\"></div>",
            expected: "<div data-a=\"bar\"></div>",
          }),
          ...varyQuotes("html", {
            input: "<div class=\"data-foo\"></div>",
            expected: "<div class=\"data-foo\"></div>",
          }),
          {
            input: "<div data-foo=\"bar\"></div>",
            expected: "<div a=\"bar\"></div>",
            prefix: "",
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
          htmlAttributeMangler.use(builtInLanguageSupport);

          const files = [new ManglerFileMock("html", input)];
          const result = htmlAttributeMangler.mangle(mangleEngine, files);
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
            input: "document.querySelectorAll(\"[data-foo]\");",
            expected: "document.querySelectorAll(\"[data-a]\");",
          }),
          ...varyQuotes("js", {
            input: "document.querySelectorAll(\".foo[data-bar]\");",
            expected: "document.querySelectorAll(\".foo[data-a]\");",
          }),
          ...varyQuotes("js", {
            input: "document.querySelectorAll(\".data-foo\");",
            expected: "document.querySelectorAll(\".data-foo\");",
          }),
          {
            input: "document.querySelectorAll(\"[data-foo]\");",
            expected: "document.querySelectorAll(\"[a]\");",
            prefix: "",
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
          htmlAttributeMangler.use(builtInLanguageSupport);

          const files = [new ManglerFileMock("js", input)];
          const result = htmlAttributeMangler.mangle(mangleEngine, files);
          expect(result).to.have.length(1);

          const out = result[0];
          expect(out.content).to.equal(expected, failureMessage);
        }
      });
    }
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
      htmlAttributeMangler.use(builtInLanguageSupport);

      const file = new ManglerFileMock("html", content);
      const result = htmlAttributeMangler.mangle(mangleEngine, [file]);
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
      htmlAttributeMangler.use(builtInLanguageSupport);

      const file = new ManglerFileMock("html", content);
      const result = htmlAttributeMangler.mangle(mangleEngine, [file]);
      expect(result).to.have.lengthOf(1);

      const out = result[0];
      for (const illegalName of illegalNames) {
        expect(out.content).not.to.have.string(illegalName);
      }
    });
  });

  test("no input files", function() {
    const htmlAttributeMangler = new HtmlAttributeMangler({
      attrNamePattern: DEFAULT_PATTERN,
    });

    const result = htmlAttributeMangler.mangle(mangleEngine, []);
    expect(result).to.have.lengthOf(0);
  });
});
