import type { SinonStub } from "sinon";

import type { CssLanguagePluginOptions } from "../../class";

import { expect, use as chaiUse } from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import initCssLanguagePlugin from "../../class";

chaiUse(sinonChai);

suite("CssLanguagePlugin class", function() {
  let CssLanguagePlugin: ReturnType<typeof initCssLanguagePlugin>;

  let getExpressionFactories: SinonStub;
  let getLanguages: SinonStub;

  suiteSetup(function() {
    getExpressionFactories = sinon.stub();
    getLanguages = sinon.stub();

    getExpressionFactories.returns(new Map());
    getLanguages.returns([]);

    CssLanguagePlugin = initCssLanguagePlugin({
      getExpressionFactories,
      getLanguages,
    });
  });

  setup(function() {
    getExpressionFactories.resetHistory();
    getLanguages.resetHistory();
  });

  interface TestScenario {
    readonly testName: string;
    getScenario(): CssLanguagePluginOptions | undefined;
  }

  const testScenarios: Iterable<TestScenario> = [
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
        cssExtensions: ["style"],
      }),
    },
  ];

  for (const { testName, getScenario } of testScenarios) {
    suite(testName, function() {
      let options: CssLanguagePluginOptions | undefined;

      setup(function() {
        options = getScenario();
        new CssLanguagePlugin(options);
      });

      test("the `getExpressionFactories` function is used", function() {
        expect(getExpressionFactories).to.have.callCount(1);
        expect(getExpressionFactories).to.have.been.calledWithExactly();
      });

      test("the `getLanguages` function is used", function() {
        expect(getLanguages).to.have.callCount(1);
        expect(getLanguages).to.have.been.calledWithExactly(
          options?.cssExtensions,
        );
      });
    });
  }
});
