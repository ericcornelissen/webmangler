import type { TestScenarios } from "@webmangler/testing";
import type { SinonStub } from "sinon";

import { expect, use as chaiUse } from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import {
  newGetNow,
} from "../../time";

chaiUse(sinonChai);

suite("Benchmarking runner timing", function() {
  suite("::newGetNow", function() {
    let getNow: ReturnType<typeof newGetNow>;

    let timeUtils: {
      now: SinonStub;
    };

    suiteSetup(function() {
      timeUtils = {
        now: sinon.stub(),
      };

      getNow = newGetNow(timeUtils);
    });

    setup(function() {
      timeUtils.now.resetHistory();
    });

    interface TestCase {
      readonly currentTime: number;
    }

    const scenarios: TestScenarios<TestCase[]> = [
      {
        testName: "sample of timestamps",
        getScenario: () => [
          {
            currentTime: 42,
          },
          {
            currentTime: 150,
          },
          {
            currentTime: 300,
          },
        ],
      },
    ];

    for (const { getScenario, testName } of scenarios) {
      test(testName, function() {
        for (const { currentTime } of getScenario()) {
          timeUtils.now.returns(currentTime);

          const result = getNow();
          expect(result).to.equal(currentTime);
        }
      });
    }

    test("use the provided time utilities", function() {
      getNow();
      expect(timeUtils.now).to.have.callCount(1);
    });
  });
});
