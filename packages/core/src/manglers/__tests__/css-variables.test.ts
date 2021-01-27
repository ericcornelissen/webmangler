import { expect } from "chai";

import { varyQuotes, varySpacing } from "./test-helpers";
import { TestScenario } from "./testing";

import ManglerFileMock from "../../__mocks__/mangler-file.mock";

import BuiltInLanguageSupport from "../../languages/builtin";
import mangleEngine from "../../engine";
import CssVariableMangler from "../css-variables";

const builtInLanguageSupport = new BuiltInLanguageSupport();

suite("CSS Variable Mangler", function() {
  const DEFAULT_PATTERN = "[a-z-]+";

  suite("CSS", function() {
    const scenarios: TestScenario[] = [
      {
        name: "sample",
        cases: [
          {
            input: "--foo: #000;",
            expected: "--a: #000;",
          },
          {
            input: ".foo { }",
            expected: ".foo { }",
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
          cssVariableMangler.use(builtInLanguageSupport);

          const files = [new ManglerFileMock("css", input)];
          const result = cssVariableMangler.mangle(mangleEngine, files);
          expect(result).to.have.length(1);

          const out = result[0];
          expect(out.content).to.equal(expected, failureMessage);
        }
      });
    }
  });

  suite("HTML", function() {
    const scenarios: TestScenario[] = [
      {
        name: "sample",
        cases: [
          ...varySpacing("=", {
            input: "<div style=\"--foo: #000;\"></div>",
            expected: "<div style=\"--a: #000;\"></div>",
          }),
          ...varyQuotes("html", {
            input: "<div style=\"--foo: #000;\"></div>",
            expected: "<div style=\"--a: #000;\"></div>",
          }),
          ...varyQuotes("html", {
            input: "<div style=\"color: #000;\"></div>",
            expected: "<div style=\"color: #000;\"></div>",
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
          cssVariableMangler.use(builtInLanguageSupport);

          const files = [new ManglerFileMock("html", input)];
          const result = cssVariableMangler.mangle(mangleEngine, files);
          expect(result).to.have.length(1);

          const out = result[0];
          expect(out.content).to.equal(expected, failureMessage);
        }
      });
    }
  });

  suite("JavaScript", function() {
    const scenarios: TestScenario[] = [
      {
        name: "sample",
        cases: [
          ...varyQuotes("js", {
            input: "$icon.style.removeProperty(\"--foobar\")",
            expected: "$icon.style.removeProperty(\"--a\")",
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
          cssVariableMangler.use(builtInLanguageSupport);

          const files = [new ManglerFileMock("js", input)];
          const result = cssVariableMangler.mangle(mangleEngine, files);
          expect(result).to.have.length(1);

          const out = result[0];
          expect(out.content).to.equal(expected, failureMessage);
        }
      });
    }
  });

  test("no input files", function() {
    const cssVariableMangler = new CssVariableMangler({
      cssVarNamePattern: DEFAULT_PATTERN,
    });

    const result = cssVariableMangler.mangle(mangleEngine, []);
    expect(result).to.have.lengthOf(0);
  });
});
