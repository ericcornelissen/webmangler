import type { TestScenario } from "@webmangler/testing";
import type { TestCase } from "./types";

import { expect } from "chai";

import {
  ATTRIBUTE_SELECTORS,
  PSEUDO_ELEMENT_SELECTORS,
  PSEUDO_SELECTORS,
} from "./css-selectors";
import { isValidIdName, varyQuotes, varySpacing } from "./test-helpers";

import ManglerFileMock from "../../__mocks__/mangler-file.mock";

import mangleEngine from "../../engine";
import BuiltInLanguageSupport from "../../languages/builtin";
import HtmlIdMangler from "../html-ids";

const builtInLanguageSupport = new BuiltInLanguageSupport();

suite("HTML ID Mangler", function() {
  const DEFAULT_PATTERN = "id[-_][a-zA-Z-_]+";

  suite("CSS", function() {
    const scenarios: TestScenario<TestCase>[] = [
      {
        name: "individual selectors",
        cases: [
          { input: "#id-foo{ }", expected: "#a{ }" },
          { input: "#id-foo { }", expected: "#a { }" },
          { input: "#foo { }", expected: "#foo { }" },
          { input: "div { }", expected: "div { }" },
          { input: ".id-foo { }", expected: ".id-foo { }" },
          { input: ".foo { }", expected: ".foo { }" },
          { input: ":root { }", expected: ":root { }" },
        ],
      },
      {
        name: "id with pseudo selectors",
        cases: [
          ...PSEUDO_SELECTORS.map((s: string): TestCase => ({
            input: `#id-foo:${s} { }`,
            expected: `#a:${s} { }`,
          })),
          ...PSEUDO_ELEMENT_SELECTORS.map((s: string): TestCase => ({
            input: `#id-foo::${s} { }`,
            expected: `#a::${s} { }`,
          })),
        ],
      },
      {
        name: "id with attribute selectors",
        cases: [
          ...ATTRIBUTE_SELECTORS.map((s: string): TestCase => ({
            input: `#id-foo[${s}] { }`,
            expected: `#a[${s}] { }`,
          })),
        ],
      },
      {
        name: "inverted id selectors",
        cases: [
          ...varySpacing(["(", ")"], {
            input: ":not(#id-foo) { }",
            expected: ":not(#a) { }",
          }),
        ],
      },
      {
        name: "or selectors",
        cases: [
          ...varySpacing(",", {
            input: "div,#id-foo { }",
            expected: "div,#a { }",
          }),
          ...varySpacing(",", {
            input: "#id-foo,span { }",
            expected: "#a,span { }",
          }),
          ...varySpacing(",", {
            input: "div,#id-foo,span { }",
            expected: "div,#a,span { }",
          }),
        ],
      },
      {
        name: "and selectors",
        cases: [
          { input: "div#id-foo { }", expected: "div#a { }" },
          { input: ".foo#id-bar { }", expected: ".foo#a { }" },
          { input: ".id-foo#id-bar { }", expected: ".id-foo#a { }" },
          { input: "#id-foo#id-bar { }", expected: "#a#b { }" },
          { input: "div.foo#id-bar { }", expected: "div.foo#a { }" },
        ],
      },
      {
        name: "descendent selectors",
        cases: [
          { input: "div #id-foo { }", expected: "div #a { }" },
          { input: ".foo #id-bar { }", expected: ".foo #a { }" },
          { input: ".id-foo #id-bar { }", expected: ".id-foo #a { }" },
          { input: "#id-foo div { }", expected: "#a div { }" },
          { input: "#id-foo .bar { }", expected: "#a .bar { }" },
          { input: "#id-foo .id-bar { }", expected: "#a .id-bar { }" },
          { input: "#id-foo #id-bar { }", expected: "#a #b { }" },
        ],
      },
      {
        name: "child selectors",
        cases: [
          ...varySpacing(">", {
            input: "div>#id-foo { }",
            expected: "div>#a { }",
          }),
          ...varySpacing(">", {
            input: "#id-foo>div { }",
            expected: "#a>div { }",
          }),
        ],
      },
      {
        name: "sibling selectors",
        cases: [
          ...varySpacing("+", {
            input: "div+#id-foo { }",
            expected: "div+#a { }",
          }),
          ...varySpacing("+", {
            input: "#id-foo+div { }",
            expected: "#a+div { }",
          }),
        ],
      },
      {
        name: "preceded selectors",
        cases: [
          ...varySpacing("~", {
            input: "div~#id-foo { }",
            expected: "div~#a { }",
          }),
          ...varySpacing("~", {
            input: "#id-foo~div { }",
            expected: "#a~div { }",
          }),
        ],
      },
      {
        name: "multiple ids",
        cases: [
          {
            input: "#id-foo { } #id-bar { }",
            expected: "#a { } #b { }",
          },
        ],
      },
      {
        name: "repeated ids",
        cases: [
          {
            input: "#id-foo { } #id-foo { }",
            expected: "#a { } #a { }",
          },
          {
            input: "#id-foo { } .bar#id-foo { }",
            expected: "#a { } .bar#a { }",
          },
          {
            input: "#id-foo { } .bar#id-foo { } div #id-foo { }",
            expected: "#a { } .bar#a { } div #a { }",
          },
        ],
      },
      {
        name: "ids sharing names with other selectors",
        cases: [
          {
            input: "div { } #div { }",
            expected: "div { } #a { }",
            pattern: "[a-zA-Z-]+",
          },
          {
            input: ".foo { } #foo { }",
            expected: ".foo { } #a { }",
            pattern: "[a-zA-Z-]+",
          },
          ...ATTRIBUTE_SELECTORS
            .filter(isValidIdName)
            .map((s: string): TestCase => {
              return {
                input: `div[${s}] { } #${s} { }`,
                expected: `div[${s}] { } #a { }`,
                pattern: "[a-zA-Z-]+",
              };
            }),
          ...PSEUDO_SELECTORS
            .filter(isValidIdName)
            .map((s: string): TestCase => {
              return {
                input: `input:${s} { } #${s} { }`,
                expected: `input:${s} { } #a { }`,
                pattern: "[a-zA-Z-]+",
              };
            }),
          ...PSEUDO_ELEMENT_SELECTORS
            .filter(isValidIdName)
            .map((s: string): TestCase => {
              return {
                input: `div::${s} { } #${s} { }`,
                expected: `div::${s} { } #a { }`,
                pattern: "[a-zA-Z-]+",
              };
            }),
        ],
      },
      {
        name: "reserved ids",
        cases: [
          {
            input: "#id-foo { }",
            reserved: ["a"],
            expected: "#b { }",
          },
          {
            input: "#id-foo { }",
            reserved: ["a", "b", "c"],
            expected: "#d { }",
          },
          {
            input: "#id-foo { } #id-bar { }",
            reserved: ["b"],
            expected: "#a { } #c { }",
          },
          {
            input: "#id-foo { } .bar { } div#id-praise { } #id-the, #id-sun { }",
            reserved: ["b", "d"],
            expected: "#a { } .bar { } div#c { } #e, #f { }",
          },
        ],
      },
      {
        name: "prefixed mangling",
        cases: [
          {
            input: "#id-foo { }",
            prefix: "mangled-",
            expected: "#mangled-a { }",
          },
          {
            input: "#id-foo { } #id-bar { }",
            prefix: "id-",
            expected: "#id-a { } #id-b { }",
          },
          {
            input: "#foo-bar { } #foo-baz { }",
            pattern: "foo-[a-z]+",
            prefix: "foo-",
            expected: "#foo-a { } #foo-b { }",
          },
        ],
      },
      {
        name: "input classes and mangled classes intersect",
        cases: [
          {
            input: "#a { } #b { }",
            expected: "#a { } #b { }",
            pattern: "[a-z]",
          },
          {
            input: "#b { } #a { }",
            expected: "#a { } #b { }",
            pattern: "[a-z]",
          },
          {
            input: "#a, #c, #b { }",
            expected: "#a, #b, #c { }",
            pattern: "[a-z]",
          },
          {
            input: "#d, #c, #b, #a { }",
            expected: "#a, #b, #c, #d { }",
            pattern: "[a-z]",
          },
        ],
      },
      {
        name: "corner cases",
        cases: [
          {
            input: "#id-a#id-a#id-b#id-b.id-a#id-a#id-b#id-b { }",
            expected: "#b#b#a#a.id-a#b#a#a { }",
            description: `
              Repeated classes in a single selector, although meaningless,
              should be handled correctly.
            `,
          },
          {
            input: "#id-foo",
            expected: "#id-foo",
            description: "Unclear what should happen with dangling classes...",
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
            pattern: idNamePattern,
            reserved: reservedIds,
            prefix: keepIdPrefix,
            description: failureMessage,
          } = testCase;

          const htmlIdMangler = new HtmlIdMangler({
            idNamePattern: idNamePattern || DEFAULT_PATTERN,
            reservedIds: reservedIds,
            keepIdPrefix: keepIdPrefix,
          });
          htmlIdMangler.use(builtInLanguageSupport);

          const files = [new ManglerFileMock("css", input)];
          const result = htmlIdMangler.mangle(mangleEngine, files);
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
            input: "<div id=\"id-foo\"></div>",
            expected: "<div id=\"a\"></div>",
          }),
          ...varyQuotes("html", {
            input: "<div id=\"id-foo\"></div>",
            expected: "<div id=\"a\"></div>",
          }),
          ...varySpacing("=", {
            input: "<div href=\"#id-foo\"></div>",
            expected: "<div href=\"#a\"></div>",
          }),
          ...varyQuotes("html", {
            input: "<div href=\"#id-foo\"></div>",
            expected: "<div href=\"#a\"></div>",
          }),
          ...varyQuotes("html", {
            input: "<div href=\"www.id-foo.com\"></div>",
            expected: "<div href=\"www.id-foo.com\"></div>",
          }),
          {
            input: "<div class=\"id-foo\"></div>",
            expected: "<div class=\"id-foo\"></div>",
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
            pattern: idNamePattern,
            reserved: reservedIds,
            prefix: keepIdPrefix,
            description: failureMessage,
          } = testCase;

          const htmlIdMangler = new HtmlIdMangler({
            idNamePattern: idNamePattern || DEFAULT_PATTERN,
            reservedIds: reservedIds,
            keepIdPrefix: keepIdPrefix,
          });
          htmlIdMangler.use(builtInLanguageSupport);

          const files = [new ManglerFileMock("html", input)];
          const result = htmlIdMangler.mangle(mangleEngine, files);
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
            input: "document.getElementById(\"id-foo\");",
            expected: "document.getElementById(\"a\");",
          }),
          ...varyQuotes("js", {
            input: "document.querySelector(\"#id-foo\");",
            expected: "document.querySelector(\"#a\");",
          }),
          {
            input: "var id_foo = \".id-bar\");",
            expected: "var id_foo = \".id-bar\");",
            pattern: "id[-_][a-z]+",
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
            pattern: idNamePattern,
            reserved: reservedIds,
            prefix: keepIdPrefix,
            description: failureMessage,
          } = testCase;

          const htmlIdMangler = new HtmlIdMangler({
            idNamePattern: idNamePattern || DEFAULT_PATTERN,
            reservedIds: reservedIds,
            keepIdPrefix: keepIdPrefix,
          });
          htmlIdMangler.use(builtInLanguageSupport);

          const files = [new ManglerFileMock("js", input)];
          const result = htmlIdMangler.mangle(mangleEngine, files);
          expect(result).to.have.length(1);

          const out = result[0];
          expect(out.content).to.equal(expected, failureMessage);
        }
      });
    }
  });

  test("no input files", function() {
    const htmlIdMangler = new HtmlIdMangler({
      idNamePattern: DEFAULT_PATTERN,
    });

    const result = htmlIdMangler.mangle(mangleEngine, []);
    expect(result).to.have.lengthOf(0);
  });
});
