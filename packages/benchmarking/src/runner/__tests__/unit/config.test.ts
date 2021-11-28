import type { TestScenarios } from "@webmangler/testing";

import { expect, use as chaiUse } from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import {
  getRepetitions,
  getSetupFn,
} from "../../config";

chaiUse(sinonChai);

suite("Benchmarking runner config", function() {
  suite("::getRepetitions", function() {
    interface TestCase {
      readonly repetitions: number;
    }

    const scenarios: TestScenarios<TestCase[]> = [
      {
        testName: "valid number or repetitions",
        getScenario: () => [
          {
            repetitions: 100,
          },
          {
            repetitions: 1500,
          },
          {
            repetitions: 42,
          },
        ],
      },
    ];

    for (const { getScenario, testName } of scenarios) {
      test(testName, function() {
        for (const { repetitions } of getScenario()) {
          const result = getRepetitions({ repetitions });
          expect(result).to.equal(repetitions);
        }
      });
    }

    test("default repetitions", function() {
      const result = getRepetitions({ });
      expect(result).to.equal(200);
    });
  });

  suite("::getSetupFn", function() {
    test("custom setup function", function() {
      const setupFn = sinon.fake() as () => void;

      const result = getSetupFn({ setup: setupFn });
      expect(result).to.equal(setupFn);

      result();
      expect(setupFn).to.have.callCount(1);
    });

    test("default setup function", function() {
      const result = getSetupFn({ });
      expect(result).not.to.be.null;

      const setupResult = result();
      expect(setupResult).to.be.undefined;
    });
  });
});
