import type { SinonStub } from "sinon";

import type { HtmlAttributeManglerOptions } from "../../types";

import { expect, use as chaiUse } from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import initHtmlAttributeMangler from "../../class";

chaiUse(sinonChai);

interface TestScenario {
  readonly suiteName: string;
  readonly testCase: HtmlAttributeManglerOptions | undefined;
}

suite("HtmlAttributeMangler class", function() {
  let HtmlAttributeMangler: ReturnType<typeof initHtmlAttributeMangler>;

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

    HtmlAttributeMangler = initHtmlAttributeMangler({
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
        attrNamePattern: "foo[a-z]{3}",
      },
    },
    {
      suiteName: "Only ignore patterns",
      testCase: {
        ignoreAttrNamePattern: "[a-z]{3}bar",
      },
    },
    {
      suiteName: "Only reserved names",
      testCase: {
        reservedAttrNames: ["foo", "bar"],
      },
    },
    {
      suiteName: "Only prefix",
      testCase: {
        keepAttrPrefix: "data-",
      },
    },
    {
      suiteName: "Patterns and ignore patterns",
      testCase: {
        attrNamePattern: "foo[a-z]{3}",
        ignoreAttrNamePattern: "[a-z]{3}bar",
      },
    },
    {
      suiteName: "Patterns and reserved names",
      testCase: {
        attrNamePattern: "foo[a-z]{3}",
        reservedAttrNames: ["foo", "bar"],
      },
    },
    {
      suiteName: "Patterns and prefix",
      testCase: {
        attrNamePattern: "foo[a-z]{3}",
        keepAttrPrefix: "data-",
      },
    },
    {
      suiteName: "Ignore patterns and reserved names",
      testCase: {
        ignoreAttrNamePattern: "[a-z]{3}bar",
        reservedAttrNames: ["foo", "bar"],
      },
    },
    {
      suiteName: "Ignore patterns and prefix",
      testCase: {
        ignoreAttrNamePattern: "[a-z]{3}bar",
        keepAttrPrefix: "data-",
      },
    },
    {
      suiteName: "Reserved names and prefix",
      testCase: {
        reservedAttrNames: ["foo", "bar"],
        keepAttrPrefix: "data-",
      },
    },
    {
      suiteName: "Patterns, ignore patterns, and reserved names",
      testCase: {
        attrNamePattern: "foo[a-z]{3}",
        ignoreAttrNamePattern: "[a-z]{3}bar",
        reservedAttrNames: ["foo", "bar"],
      },
    },
    {
      suiteName: "Patterns, ignore patterns, and prefix",
      testCase: {
        attrNamePattern: "foo[a-z]{3}",
        ignoreAttrNamePattern: "[a-z]{3}bar",
        keepAttrPrefix: "data-",
      },
    },
    {
      suiteName: "Ignore patterns, reserved names, and prefix",
      testCase: {
        ignoreAttrNamePattern: "[a-z]{3}bar",
        reservedAttrNames: ["foo", "bar"],
        keepAttrPrefix: "data-",
      },
    },
    {
      suiteName: "Patterns, ignore patterns, reserved names, and prefix",
      testCase: {
        attrNamePattern: "foo[a-z]{3}",
        ignoreAttrNamePattern: "[a-z]{3}bar",
        reservedAttrNames: ["foo", "bar"],
        keepAttrPrefix: "data-",
      },
    },
  ];

  for (const { suiteName, testCase } of testScenarios) {
    suite(suiteName, function() {
      const options = testCase;

      setup(function() {
        new HtmlAttributeMangler(options);
      });

      test("the `getCharacterSet` function is used", function() {
        expect(getCharacterSet).to.have.callCount(1);
        expect(getLanguageOptions).to.have.been.calledWithExactly();
      });

      test("the `getIgnorePatterns` function is used", function() {
        expect(getIgnorePatterns).to.have.callCount(1);
        expect(getIgnorePatterns).to.have.been.calledWithExactly(
          options?.ignoreAttrNamePattern,
        );
      });

      test("the `getLanguageOptions` function is used", function() {
        expect(getLanguageOptions).to.have.callCount(1);
        expect(getLanguageOptions).to.have.been.calledWithExactly();
      });

      test("the `getPatterns` function is used", function() {
        expect(getPatterns).to.have.callCount(1);
        expect(getPatterns).to.have.been.calledWithExactly(
          options?.attrNamePattern,
        );
      });

      test("the `getPrefix` function is used", function() {
        expect(getPrefix).to.have.callCount(1);
        expect(getPrefix).to.have.been.calledWithExactly(
          options?.keepAttrPrefix,
        );
      });

      test("the `getReserved` function is used", function() {
        expect(getReserved).to.have.callCount(1);
        expect(getReserved).to.have.been.calledWithExactly(
          options?.reservedAttrNames,
        );
      });
    });
  }
});
