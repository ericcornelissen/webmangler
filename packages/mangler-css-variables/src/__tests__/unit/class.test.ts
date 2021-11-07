import type { SinonStub } from "sinon";

import type { CssVariableManglerOptions } from "../../types";

import { expect, use as chaiUse } from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import initCssVariableMangler from "../../class";

chaiUse(sinonChai);

interface TestScenario {
  readonly suiteName: string;
  readonly testCase: CssVariableManglerOptions | undefined;
}

suite("CssVariableMangler class", function() {
  let CssVariableMangler: ReturnType<typeof initCssVariableMangler>;

  let getCharacterSet: SinonStub;
  let getPatterns: SinonStub;
  let getIgnorePatterns: SinonStub;
  let getReserved: SinonStub;
  let getPrefix: SinonStub;
  let getLanguageOptions: SinonStub;

  suiteSetup(function() {
    getCharacterSet = sinon.stub();
    getPatterns = sinon.stub();
    getIgnorePatterns = sinon.stub();
    getReserved = sinon.stub();
    getPrefix = sinon.stub();
    getLanguageOptions = sinon.stub();

    CssVariableMangler = initCssVariableMangler({
      getCharacterSet,
      getPatterns,
      getIgnorePatterns,
      getReserved,
      getPrefix,
      getLanguageOptions,
    });
  });

  setup(function() {
    getCharacterSet.resetHistory();
    getPatterns.resetHistory();
    getIgnorePatterns.resetHistory();
    getReserved.resetHistory();
    getPrefix.resetHistory();
    getLanguageOptions.resetHistory();
  });

  const testScenarios: Iterable<TestScenario> = [
    {
      suiteName: "No config",
      testCase: undefined,
    },
    {
      suiteName: "Empty configuration object",
      testCase: { },
    },
    {
      suiteName: "Only patterns",
      testCase: {
        cssVarNamePattern: "foo[a-z]{3}",
      },
    },
    {
      suiteName: "Only ignore patterns",
      testCase: {
        ignoreCssVarNamePattern: "[a-z]{3}bar",
      },
    },
    {
      suiteName: "Only reserved names",
      testCase: {
        reservedCssVarNames: ["foo", "bar"],
      },
    },
    {
      suiteName: "Only prefix",
      testCase: {
        keepCssVarPrefix: "var-",
      },
    },
    {
      suiteName: "Patterns and ignore patterns",
      testCase: {
        cssVarNamePattern: "foo[a-z]{3}",
        ignoreCssVarNamePattern: "[a-z]{3}bar",
      },
    },
    {
      suiteName: "Patterns and reserved names",
      testCase: {
        cssVarNamePattern: "foo[a-z]{3}",
        reservedCssVarNames: ["foo", "bar"],
      },
    },
    {
      suiteName: "Patterns and prefix",
      testCase: {
        cssVarNamePattern: "foo[a-z]{3}",
        keepCssVarPrefix: "var-",
      },
    },
    {
      suiteName: "Ignore patterns and reserved names",
      testCase: {
        ignoreCssVarNamePattern: "[a-z]{3}bar",
        reservedCssVarNames: ["foo", "bar"],
      },
    },
    {
      suiteName: "Ignore patterns and prefix",
      testCase: {
        ignoreCssVarNamePattern: "[a-z]{3}bar",
        keepCssVarPrefix: "var-",
      },
    },
    {
      suiteName: "Reserved names and prefix",
      testCase: {
        reservedCssVarNames: ["foo", "bar"],
        keepCssVarPrefix: "var-",
      },
    },
    {
      suiteName: "Patterns, ignore patterns, and reserved names",
      testCase: {
        cssVarNamePattern: "foo[a-z]{3}",
        ignoreCssVarNamePattern: "[a-z]{3}bar",
        reservedCssVarNames: ["foo", "bar"],
      },
    },
    {
      suiteName: "Patterns, ignore patterns, and prefix",
      testCase: {
        cssVarNamePattern: "foo[a-z]{3}",
        ignoreCssVarNamePattern: "[a-z]{3}bar",
        keepCssVarPrefix: "var-",
      },
    },
    {
      suiteName: "Ignore patterns, reserved names, and prefix",
      testCase: {
        ignoreCssVarNamePattern: "[a-z]{3}bar",
        reservedCssVarNames: ["foo", "bar"],
        keepCssVarPrefix: "var-",
      },
    },
    {
      suiteName: "Patterns, ignore patterns, reserved names, and prefix",
      testCase: {
        cssVarNamePattern: "foo[a-z]{3}",
        ignoreCssVarNamePattern: "[a-z]{3}bar",
        reservedCssVarNames: ["foo", "bar"],
        keepCssVarPrefix: "var-",
      },
    },
  ];

  for (const { suiteName, testCase } of testScenarios) {
    suite(suiteName, function() {
      const options = testCase;

      setup(function() {
        new CssVariableMangler(options);
      });

      test("the getCharacterSet function is used", function() {
        expect(getCharacterSet).to.have.callCount(1);
        expect(getCharacterSet).to.have.been.calledWithExactly(
          options || {},
        );
      });

      test("the getPatterns function is used", function() {
        expect(getPatterns).to.have.callCount(1);
        expect(getPatterns).to.have.been.calledWithExactly(
          options?.cssVarNamePattern,
        );
      });

      test("the getIgnorePatterns function is used", function() {
        expect(getIgnorePatterns).to.have.callCount(1);
        expect(getIgnorePatterns).to.have.been.calledWithExactly(
          options?.ignoreCssVarNamePattern,
        );
      });

      test("the getReserved function is used", function() {
        expect(getReserved).to.have.callCount(1);
        expect(getReserved).to.have.been.calledWithExactly(
          options?.reservedCssVarNames,
        );
      });

      test("the getPrefix function is used", function() {
        expect(getPrefix).to.have.callCount(1);
        expect(getPrefix).to.have.been.calledWithExactly(
          options?.keepCssVarPrefix,
        );
      });

      test("the getLanguageOptions function is used", function() {
        expect(getLanguageOptions).to.have.callCount(1);
        expect(getLanguageOptions).to.have.been.calledWithExactly(
          options || { },
        );
      });
    });
  }
});
