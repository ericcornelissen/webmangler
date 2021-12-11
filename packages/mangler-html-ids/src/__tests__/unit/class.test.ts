import type { SinonStub } from "sinon";

import type { HtmlIdManglerOptions } from "../../types";

import { expect, use as chaiUse } from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import initHtmlIdMangler from "../../class";

chaiUse(sinonChai);

suite("HtmlIdMangler initializer", function() {
  let HtmlIdMangler: ReturnType<typeof initHtmlIdMangler>;

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

    HtmlIdMangler = initHtmlIdMangler({
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

  interface TestScenario {
    readonly suiteName: string;
    readonly testCase: HtmlIdManglerOptions | undefined;
  }

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
        idNamePattern: "foo[a-z]{3}",
      },
    },
    {
      suiteName: "Only ignore patterns",
      testCase: {
        ignoreIdNamePattern: "[a-z]{3}bar",
      },
    },
    {
      suiteName: "Only reserved names",
      testCase: {
        reservedIds: ["foo", "bar"],
      },
    },
    {
      suiteName: "Only prefix",
      testCase: {
        keepIdPrefix: "id-",
      },
    },
    {
      suiteName: "Only ID attribute names",
      testCase: {
        idAttributes: ["do", "the", "thing"],
      },
    },
    {
      suiteName: "Only URL attribute names",
      testCase: {
        urlAttributes: ["praise", "the", "sun"],
      },
    },
    {
      suiteName: "Patterns and ignore patterns",
      testCase: {
        idNamePattern: "foo[a-z]{3}",
        ignoreIdNamePattern: "[a-z]{3}bar",
      },
    },
    {
      suiteName: "Patterns and reserved names",
      testCase: {
        idNamePattern: "foo[a-z]{3}",
        reservedIds: ["foo", "bar"],
      },
    },
    {
      suiteName: "Patterns and prefix",
      testCase: {
        idNamePattern: "foo[a-z]{3}",
        keepIdPrefix: "id-",
      },
    },
    {
      suiteName: "Patterns and ID attribute names",
      testCase: {
        idNamePattern: "foo[a-z]{3}",
        idAttributes: ["do", "the", "thing"],
      },
    },
    {
      suiteName: "Patterns and URL attribute names",
      testCase: {
        idNamePattern: "foo[a-z]{3}",
        urlAttributes: ["praise", "the", "sun"],
      },
    },
    {
      suiteName: "Ignore patterns and reserved names",
      testCase: {
        ignoreIdNamePattern: "[a-z]{3}bar",
        reservedIds: ["foo", "bar"],
      },
    },
    {
      suiteName: "Ignore patterns and prefix",
      testCase: {
        ignoreIdNamePattern: "[a-z]{3}bar",
        keepIdPrefix: "id-",
      },
    },
    {
      suiteName: "Reserved names and prefix",
      testCase: {
        reservedIds: ["foo", "bar"],
        keepIdPrefix: "id-",
      },
    },
    {
      suiteName: "Prefix and ID attribute names",
      testCase: {
        keepIdPrefix: "id-",
        idAttributes: ["do", "the", "thing"],
      },
    },
    {
      suiteName: "Prefix and URL attribute names",
      testCase: {
        keepIdPrefix: "id-",
        urlAttributes: ["praise", "the", "sun"],
      },
    },
    {
      suiteName: "ID attribute names and URL attribute names",
      testCase: {
        idAttributes: ["do", "the", "thing"],
        urlAttributes: ["praise", "the", "sun"],
      },
    },
    {
      suiteName: "Patterns, ignore patterns, and reserved names",
      testCase: {
        idNamePattern: "foo[a-z]{3}",
        ignoreIdNamePattern: "[a-z]{3}bar",
        reservedIds: ["foo", "bar"],
      },
    },
    {
      suiteName: "Patterns, ignore patterns, and prefix",
      testCase: {
        idNamePattern: "foo[a-z]{3}",
        ignoreIdNamePattern: "[a-z]{3}bar",
        keepIdPrefix: "id-",
      },
    },
    {
      suiteName: "Patterns, ignore patterns, and ID attribute names",
      testCase: {
        idNamePattern: "foo[a-z]{3}",
        ignoreIdNamePattern: "[a-z]{3}bar",
        idAttributes: ["do", "the", "thing"],
      },
    },
    {
      suiteName: "Patterns, ignore patterns, and URL attribute names",
      testCase: {
        idNamePattern: "foo[a-z]{3}",
        ignoreIdNamePattern: "[a-z]{3}bar",
        urlAttributes: ["praise", "the", "sun"],
      },
    },
    {
      suiteName: "Patterns, prefix, and ID attribute names",
      testCase: {
        idNamePattern: "foo[a-z]{3}",
        keepIdPrefix: "id-",
        idAttributes: ["do", "the", "thing"],
      },
    },
    {
      suiteName: "Patterns, prefix, and URL attribute names",
      testCase: {
        idNamePattern: "foo[a-z]{3}",
        keepIdPrefix: "id-",
        urlAttributes: ["praise", "the", "sun"],
      },
    },
    {
      suiteName: "Patterns, ID attribute names, and URL attribute names",
      testCase: {
        idNamePattern: "foo[a-z]{3}",
        idAttributes: ["do", "the", "thing"],
        urlAttributes: ["praise", "the", "sun"],
      },
    },
    {
      suiteName: "Ignore patterns, reserved names, and prefix",
      testCase: {
        ignoreIdNamePattern: "[a-z]{3}bar",
        reservedIds: ["foo", "bar"],
        keepIdPrefix: "id-",
      },
    },
    {
      suiteName: "Ignore patterns, reserved names, and ID attribute names",
      testCase: {
        ignoreIdNamePattern: "[a-z]{3}bar",
        reservedIds: ["foo", "bar"],
        idAttributes: ["do", "the", "thing"],
      },
    },
    {
      suiteName: "Ignore patterns, reserved names, and URL attribute names",
      testCase: {
        ignoreIdNamePattern: "[a-z]{3}bar",
        reservedIds: ["foo", "bar"],
        urlAttributes: ["praise", "the", "sun"],
      },
    },
    {
      suiteName: "Ignore patterns, prefix, and ID attribute names",
      testCase: {
        ignoreIdNamePattern: "[a-z]{3}bar",
        keepIdPrefix: "id-",
        idAttributes: ["do", "the", "thing"],
      },
    },
    {
      suiteName: "Ignore patterns, prefix, and URL attribute names",
      testCase: {
        ignoreIdNamePattern: "[a-z]{3}bar",
        keepIdPrefix: "id-",
        urlAttributes: ["praise", "the", "sun"],
      },
    },
    {
      suiteName: "Ignore patterns, ID attribute name, and URL attribute names",
      testCase: {
        ignoreIdNamePattern: "[a-z]{3}bar",
        idAttributes: ["do", "the", "thing"],
        urlAttributes: ["praise", "the", "sun"],
      },
    },
    {
      suiteName: "Reserved names, prefix, and ID attribute names",
      testCase: {
        reservedIds: ["foo", "bar"],
        keepIdPrefix: "id-",
        idAttributes: ["do", "the", "thing"],
      },
    },
    {
      suiteName: "Reserved names, prefix, and URL attribute names",
      testCase: {
        reservedIds: ["foo", "bar"],
        keepIdPrefix: "id-",
        urlAttributes: ["praise", "the", "sun"],
      },
    },
    {
      suiteName: "Reserved names, ID attribute names, and URL attribute names",
      testCase: {
        reservedIds: ["foo", "bar"],
        idAttributes: ["do", "the", "thing"],
        urlAttributes: ["praise", "the", "sun"],
      },
    },
    {
      suiteName: "Prefix, ID attribute names, and URL attribute names",
      testCase: {
        keepIdPrefix: "id-",
        idAttributes: ["do", "the", "thing"],
        urlAttributes: ["praise", "the", "sun"],
      },
    },
    {
      suiteName: "Names, ignored, reserved, and prefix",
      testCase: {
        idNamePattern: "foo[a-z]{3}",
        ignoreIdNamePattern: "[a-z]{3}bar",
        reservedIds: ["foo", "bar"],
        keepIdPrefix: "id-",
      },
    },
    {
      suiteName: "Names, ignored, reserved, and ID names",
      testCase: {
        idNamePattern: "foo[a-z]{3}",
        ignoreIdNamePattern: "[a-z]{3}bar",
        reservedIds: ["foo", "bar"],
        idAttributes: ["do", "the", "thing"],
      },
    },
    {
      suiteName: "Names, ignored, reserved, and URL names",
      testCase: {
        idNamePattern: "foo[a-z]{3}",
        ignoreIdNamePattern: "[a-z]{3}bar",
        reservedIds: ["foo", "bar"],
        urlAttributes: ["praise", "the", "sun"],
      },
    },
    {
      suiteName: "Ignored, reserved, prefix, and ID names",
      testCase: {
        ignoreIdNamePattern: "[a-z]{3}bar",
        reservedIds: ["foo", "bar"],
        keepIdPrefix: "id-",
        idAttributes: ["do", "the", "thing"],
      },
    },
    {
      suiteName: "Ignored, reserved, prefix, and URL names",
      testCase: {
        ignoreIdNamePattern: "[a-z]{3}bar",
        reservedIds: ["foo", "bar"],
        keepIdPrefix: "id-",
        urlAttributes: ["praise", "the", "sun"],
      },
    },
    {
      suiteName: "Reserved, prefix, ID names, and URL names",
      testCase: {
        reservedIds: ["foo", "bar"],
        keepIdPrefix: "id-",
        idAttributes: ["do", "the", "thing"],
        urlAttributes: ["praise", "the", "sun"],
      },
    },
    {
      suiteName: "Names, ignored, reserved, prefix, ID names, and URL names",
      testCase: {
        idNamePattern: "foo[a-z]{3}",
        ignoreIdNamePattern: "[a-z]{3}bar",
        reservedIds: ["foo", "bar"],
        keepIdPrefix: "id-",
        idAttributes: ["do", "the", "thing"],
        urlAttributes: ["praise", "the", "sun"],
      },
    },
  ];

  for (const { suiteName, testCase } of testScenarios) {
    suite(suiteName, function() {
      const options = testCase;

      setup(function() {
        new HtmlIdMangler(options);
      });

      test("the `getCharacterSet` function is used", function() {
        expect(getCharacterSet).to.have.callCount(1);
        expect(getCharacterSet).to.have.been.calledWithExactly(
          options || { },
        );
      });

      test("the `getIgnorePatterns` function is used", function() {
        expect(getIgnorePatterns).to.have.callCount(1);
        expect(getIgnorePatterns).to.have.been.calledWithExactly(
          options || { },
        );
      });

      test("the `getLanguageOptions` function is used", function() {
        expect(getLanguageOptions).to.have.callCount(1);
        expect(getLanguageOptions).to.have.been.calledWithExactly(
          options || { },
        );
      });

      test("the `getPatterns` function is used", function() {
        expect(getPatterns).to.have.callCount(1);
        expect(getPatterns).to.have.been.calledWithExactly(
          options || { },
        );
      });

      test("the `getPrefix` function is used", function() {
        expect(getPrefix).to.have.callCount(1);
        expect(getPrefix).to.have.been.calledWithExactly(
          options || { },
        );
      });

      test("the `getReserved` function is used", function() {
        expect(getReserved).to.have.callCount(1);
        expect(getReserved).to.have.been.calledWithExactly(
          options || { },
        );
      });
    });
  }
});
