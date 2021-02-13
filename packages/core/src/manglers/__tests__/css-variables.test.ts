import type { TestScenario } from "@webmangler/testing";
import type { TestCase } from "./types";

import { expect, use as chaiUse } from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import {
  getArrayOfFormattedStrings,
  varyQuotes,
  varySpacing,
} from "./test-helpers";

import EngineMock from "../../__mocks__/engine.mock";
import ManglerFileMock from "../../__mocks__/mangler-file.mock";

import BuiltInLanguageSupport from "../../languages/builtin";
import mangleEngine from "../../engine";
import CssVariableMangler from "../css-variables";

const builtInLanguageSupport = new BuiltInLanguageSupport();

chaiUse(sinonChai);

suite("CSS Variable Mangler", function() {
  const DEFAULT_PATTERN = "[a-z-]+";

  suite("CSS", function() {
    const scenarios: TestScenario<TestCase>[] = [
      {
        name: "variable declarations",
        cases: [
          ...varySpacing(":", {
            input: ":root{ --foo:#000; }",
            expected: ":root{ --a:#000; }",
          }),
          ...varySpacing(["{", "}"], {
            input: ".foo{--foo:#000;}",
            expected: ".foo{--a:#000;}",
          }),
          {
            input: ":root { --foo: white; --bar: black; }",
            expected: ":root { --a: white; --b: black; }",
          },
          {
            input: ".foo { --bar: white; } .bar { --foo: black; }",
            expected: ".foo { --a: white; } .bar { --b: black; }",
          },
        ],
      },
      {
        name: "variable usage",
        cases: [
          ...varySpacing(["(", ")"], {
            input: ".foo { color: var(--foo); }",
            expected: ".foo { color: var(--a); }",
          }),
          {
            input: "div { color: var(--foo); font: var(--bar); }",
            expected: "div { color: var(--a); font: var(--b); }",
          },
          {
            input: ".foo { color: var(--foo); } .bar { font: var(--bar); }",
            expected: ".foo { color: var(--a); } .bar { font: var(--b); }",
          },
          ...varySpacing([","], {
            input: ".foo { color: var(--foo,#fff); }",
            expected: ".foo { color: var(--a,#fff); }",
          }),
          {
            input: "div { color: var(--foo, #000); font: var(--bar, serif); }",
            expected: "div { color: var(--a, #000); font: var(--b, serif); }",
          },
          {
            input: ".foo { color: var(--foo, #000); } .bar { font: var(--bar, serif); }",
            expected: ".foo { color: var(--a, #000); } .bar { font: var(--b, serif); }",
          },
        ],
      },
      {
        name: "reserved class names",
        cases: [
          {
            input: ":root { --foo: 'bar'; }",
            reserved: ["a"],
            expected: ":root { --b: 'bar'; }",
          },
          {
            input: ":root { --foo: 'bar'; }",
            reserved: ["a", "b", "c"],
            expected: ":root { --d: 'bar'; }",
          },
          {
            input: ":root { --foo: white; --bar: black; }",
            reserved: ["b"],
            expected: ":root { --a: white; --c: black; }",
          },
        ],
      },
      {
        name: "prefixed mangling",
        cases: [
          {
            input: ":root { --foo: 'bar'; }",
            prefix: "mangled-",
            expected: ":root { --mangled-a: 'bar'; }",
          },
          {
            input: ":root { --foo: white; --bar: black; }",
            prefix: "var-",
            expected: ":root { --var-a: white; --var-b: black; }",
          },
          {
            input: ":root { --var-foo: white; --var-bar: black; }",
            pattern: "var-[a-z]+",
            prefix: "var-",
            expected: ":root { --var-a: white; --var-b: black; }",
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
    const scenarios: TestScenario<TestCase>[] = [
      {
        name: "variable declarations in <style>",
        cases: [
          ...varyQuotes("html", {
            input: "<div style=\"--foo: #000;\"></div>",
            expected: "<div style=\"--a: #000;\"></div>",
          }),
          ...varySpacing("=", {
            input: "<div style=\"--foo: #000;\"></div>",
            expected: "<div style=\"--a: #000;\"></div>",
          }),
          ...varySpacing(":", {
            input: "<div style=\"--foo:#000;\"></div>",
            expected: "<div style=\"--a:#000;\"></div>",
          }),
          {
            input: "<div style=\"color: red; --foo: #000;\"></div>",
            expected: "<div style=\"color: red; --a: #000;\"></div>",
          },
          {
            input: "<div style=\"--foo: #000; --bar: #FFF;\"></div>",
            expected: "<div style=\"--a: #000; --b: #FFF;\"></div>",
          },
        ],
      },
      {
        name: "variable usage in <style>",
        cases: [
          ...varyQuotes("html", {
            input: "<div style=\"color: var(--foo);\"></div>",
            expected: "<div style=\"color: var(--a);\"></div>",
          }),
          ...varySpacing(":", {
            input: "<div style=\"color:var(--foo);\"></div>",
            expected: "<div style=\"color:var(--a);\"></div>",
          }),
          ...varySpacing(["(", ")"], {
            input: "<div style=\"color: var(--foo);\"></div>",
            expected: "<div style=\"color: var(--a);\"></div>",
          }),
          ...varySpacing([","], {
            input: "<div style=\"color: var(--foo,'#000');\"></div>",
            expected: "<div style=\"color: var(--a,'#000');\"></div>",
          }),
          {
            input: "<div style=\"color: var(--foo); font: var(--bar);\"></div>",
            expected: "<div style=\"color: var(--a); font: var(--b);\"></div>",
          },
        ],
      },
      {
        name: "reserved class names",
        cases: [
          {
            input: "<div style=\"--foo: 'bar';\"></div>",
            reserved: ["a"],
            expected: "<div style=\"--b: 'bar';\"></div>",
          },
          {
            input: "<div style=\"--foo: 'bar';\"></div>",
            reserved: ["a", "b", "c"],
            expected: "<div style=\"--d: 'bar';\"></div>",
          },
          {
            input: "<div style=\"--foo: #fff; --bar: #000;\"></div>",
            reserved: ["b"],
            expected: "<div style=\"--a: #fff; --c: #000;\"></div>",
          },
        ],
      },
      {
        name: "prefixed mangling",
        cases: [
          {
            input: "<div style=\"--foo: 'bar';\"></div>",
            prefix: "mangled-",
            expected: "<div style=\"--mangled-a: 'bar';\"></div>",
          },
          {
            input: "<div style=\"--foo: #fff; --bar: #000;\"></div>",
            prefix: "var-",
            expected: "<div style=\"--var-a: #fff; --var-b: #000;\"></div>",
          },
          {
            input: "<div style=\"--var-foo: #fff; --var-bar: #000;\"></div>",
            pattern: "var-[a-z]+",
            prefix: "var-",
            expected: "<div style=\"--var-a: #fff; --var-b: #000;\"></div>",
          },
        ],
      },
      {
        name: "edge cases",
        cases: [
          {
            input: "<div style=\"--foo: 'bar'\"></div>",
            expected: "<div style=\"--a: 'bar'\"></div>",
            description: "It shouldn't be a problem if the `;` is missing",
          },
          {
            input: "<div style=\"color: var(--foo)\"></div>",
            expected: "<div style=\"color: var(--a)\"></div>",
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
      {
        name: "reserved class names",
        cases: [
          {
            input: "$el.style.getPropertyValue(\"--foobar\");",
            reserved: ["a"],
            expected: "$el.style.getPropertyValue(\"--b\");",
          },
          {
            input: "$el.style.removeProperty(\"--foobar\");",
            reserved: ["a", "b", "c"],
            expected: "$el.style.removeProperty(\"--d\");",
          },
          {
            input: "getPropertyValue(\"--foo\"); removeProperty(\"--bar\");",
            reserved: ["b"],
            expected: "getPropertyValue(\"--a\"); removeProperty(\"--c\");",
          },
        ],
      },
      {
        name: "prefixed mangling",
        cases: [
          {
            input: "$el.style.getPropertyValue(\"--foobar\");",
            prefix: "mangled-",
            expected: "$el.style.getPropertyValue(\"--mangled-a\");",
          },
          {
            input: "getPropertyValue(\"--foo\"); removeProperty(\"--bar\");",
            prefix: "var-",
            expected: "getPropertyValue(\"--var-a\"); removeProperty(\"--var-b\");",
          },
          {
            input: "getPropertyValue(\"--var-foo\"); removeProperty(\"--var-bar\");",
            pattern: "var-[a-z]+",
            prefix: "var-",
            expected: "getPropertyValue(\"--var-a\"); removeProperty(\"--var-b\");",
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

          const files = [new ManglerFileMock("js", input)];
          const result = cssVariableMangler.mangle(mangleEngine, files);
          expect(result).to.have.length(1);

          const out = result[0];
          expect(out.content).to.equal(expected, failureMessage);
        }
      });
    }
  });

  suite("Configuration", function() {
    setup(function() {
      EngineMock.resetHistory();
    });

    test("default patterns", function() {
      const expected = CssVariableMangler.DEFAULT_PATTERNS;

      const cssVariableMangler = new CssVariableMangler();
      cssVariableMangler.mangle(EngineMock, []);
      expect(EngineMock).to.have.been.calledWith(
        sinon.match.any,
        sinon.match.any,
        expected,
        sinon.match.any,
      );
    });

    test("default reserved", function() {
      const expected = CssVariableMangler.ALWAYS_RESERVED.concat(CssVariableMangler.DEFAULT_RESERVED);

      const cssVariableMangler = new CssVariableMangler();
      cssVariableMangler.mangle(EngineMock, []);
      expect(EngineMock).to.have.been.calledWith(
        sinon.match.any,
        sinon.match.any,
        sinon.match.any,
        sinon.match.has("reservedNames", expected),
      );
    });

    test("default prefix", function() {
      const expected = CssVariableMangler.DEFAULT_PREFIX;

      const cssVariableMangler = new CssVariableMangler();
      cssVariableMangler.mangle(EngineMock, []);
      expect(EngineMock).to.have.been.calledWith(
        sinon.match.any,
        sinon.match.any,
        sinon.match.any,
        sinon.match.has("manglePrefix", expected),
      );
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
      cssVariableMangler.use(builtInLanguageSupport);

      const file = new ManglerFileMock("css", content);
      const result = cssVariableMangler.mangle(mangleEngine, [file]);
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
      cssVariableMangler.use(builtInLanguageSupport);

      const file = new ManglerFileMock("css", content);
      const result = cssVariableMangler.mangle(mangleEngine, [file]);
      expect(result).to.have.lengthOf(1);

      const out = result[0];
      for (const illegalName of illegalNames) {
        expect(out.content).not.to.have.string(illegalName);
      }
    });
  });

  test("no input files", function() {
    const cssVariableMangler = new CssVariableMangler({
      cssVarNamePattern: DEFAULT_PATTERN,
    });

    const result = cssVariableMangler.mangle(mangleEngine, []);
    expect(result).to.have.lengthOf(0);
  });
});
