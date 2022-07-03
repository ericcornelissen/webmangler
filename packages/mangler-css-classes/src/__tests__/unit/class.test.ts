import type { SinonStub } from "sinon";

import type { CssClassManglerOptions } from "../../types";

import { expect, use as chaiUse } from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import initCssClassMangler from "../../class";

chaiUse(sinonChai);

suite("CssClassMangler class", function() {
  let CssClassMangler: ReturnType<typeof initCssClassMangler>;

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

    CssClassMangler = initCssClassMangler({
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

  interface TestCase {
    readonly suiteName: string;
    readonly testCase?: CssClassManglerOptions;
  }

  const testCases: TestCase[] = [
    {
      suiteName: "no options",
      testCase: undefined,
    },
    {
      suiteName: "empty options",
      testCase: { },
    },
    {
      suiteName: "class name patterns only",
      testCase: {
        classNamePattern: ["foo", "bar"],
      },
    },
    {
      suiteName: "ignore patterns only",
      testCase: {
        ignoreClassNamePattern: ["foo", "bar"],
      },
    },
    {
      suiteName: "reserved patterns only",
      testCase: {
        reservedClassNames: ["foo", "bar"],
      },
    },
    {
      suiteName: "prefix only",
      testCase: {
        keepClassNamePrefix: "cls-",
      },
    },
    {
      suiteName: "class attributes only",
      testCase: {
        classAttributes: ["foo", "bar"],
      },
    },
  ];

  for (const { suiteName, testCase } of testCases) {
    suite(suiteName, function() {
      const options = testCase;

      setup(function() {
        new CssClassMangler(options);
      });

      test("the `getCharacterSet` function is used", function() {
        expect(getCharacterSet).to.have.callCount(1);
        expect(getCharacterSet).to.have.been.calledWithExactly();
      });

      test("the `getIgnorePatterns` function is used", function() {
        expect(getIgnorePatterns).to.have.callCount(1);
        expect(getIgnorePatterns).to.have.been.calledWithExactly(
          options?.ignoreClassNamePattern,
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
          options?.classNamePattern,
        );
      });

      test("the `getPrefix` function is used", function() {
        expect(getPrefix).to.have.callCount(1);
        expect(getPrefix).to.have.been.calledWithExactly(
          options?.keepClassNamePrefix,
        );
      });

      test("the `getReserved` function is used", function() {
        expect(getReserved).to.have.callCount(1);
        expect(getReserved).to.have.been.calledWithExactly(
          options?.reservedClassNames,
        );
      });
    });
  }
});
