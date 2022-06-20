import type { TestScenarios } from "@webmangler/testing";
import type { SinonStub } from "sinon";

import type { JavaScriptLanguagePluginOptions } from "../../class";

import { expect, use as chaiUse } from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import initJavaScriptLanguagePlugin from "../../class";

chaiUse(sinonChai);

suite("JavaScriptLanguagePlugin class", function() {
  let JavaScriptLanguagePlugin: ReturnType<typeof initJavaScriptLanguagePlugin>;

  let getExpressionFactories: SinonStub;
  let getLanguages: SinonStub;

  suiteSetup(function() {
    getExpressionFactories = sinon.stub();
    getLanguages = sinon.stub();

    getExpressionFactories.returns(new Map());
    getLanguages.returns([]);

    JavaScriptLanguagePlugin = initJavaScriptLanguagePlugin({
      getExpressionFactories,
      getLanguages,
    });
  });

  setup(function() {
    getExpressionFactories.resetHistory();
    getLanguages.resetHistory();
  });

  type TestCase = JavaScriptLanguagePluginOptions | undefined;

  const testScenarios: TestScenarios<TestCase> = [
    {
      testName: "No configuration object",
      getScenario: () => undefined,
    },
    {
      testName: "Empty configuration object",
      getScenario: () => ({ }),
    },
    {
      testName: "Only extensions",
      getScenario: () => ({
        jsExtensions: ["javaScript"],
      }),
    },
  ];

  for (const { testName, getScenario } of testScenarios) {
    suite(testName, function() {
      let options: JavaScriptLanguagePluginOptions | undefined;

      setup(function() {
        options = getScenario();
        new JavaScriptLanguagePlugin(options);
      });

      test("the `getExpressionFactories` function is used", function() {
        expect(getExpressionFactories).to.have.callCount(1);
        expect(getExpressionFactories).to.have.been.calledWithExactly(
          options || {},
        );
      });

      test("the `getLanguages` function is used", function() {
        expect(getLanguages).to.have.callCount(1);
        expect(getLanguages).to.have.been.calledWithExactly(
          options || {},
        );
      });
    });
  }
});
