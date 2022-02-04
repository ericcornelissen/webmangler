import type { TestScenarios } from "@webmangler/testing";
import type { SinonStub } from "sinon";

import type { HtmlLanguagePluginOptions } from "../../class";

import { expect, use as chaiUse } from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import initHtmlLanguagePlugin from "../../class";

chaiUse(sinonChai);

suite("HtmlLanguagePlugin class", function() {
  let HtmlLanguagePlugin: ReturnType<typeof initHtmlLanguagePlugin>;

  let getEmbedFinders: SinonStub;
  let getExpressionFactories: SinonStub;
  let getLanguages: SinonStub;

  suiteSetup(function() {
    getEmbedFinders = sinon.stub();
    getExpressionFactories = sinon.stub();
    getLanguages = sinon.stub();

    HtmlLanguagePlugin = initHtmlLanguagePlugin({
      getEmbedFinders,
      getExpressionFactories,
      getLanguages,
    });
  });

  setup(function() {
    getEmbedFinders.resetHistory();
    getExpressionFactories.resetHistory();
    getLanguages.resetHistory();
  });

  type TestCase = HtmlLanguagePluginOptions | undefined;

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
        htmlExtensions: ["html5"],
      }),
    },
  ];

  for (const { testName, getScenario } of testScenarios) {
    suite(testName, function() {
      let options: HtmlLanguagePluginOptions | undefined;

      setup(function() {
        options = getScenario();
        new HtmlLanguagePlugin(options);
      });

      test("the `getEmbedFinders` function is used", function() {
        expect(getEmbedFinders).to.have.callCount(1);
        expect(getEmbedFinders).to.have.been.calledWithExactly(
          options || {},
        );
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
