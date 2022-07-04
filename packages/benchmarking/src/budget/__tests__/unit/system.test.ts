import type { TestScenarios } from "@webmangler/testing";
import type { SinonStub } from "sinon";

import type { CPU } from "../../system";

import { expect, use as chaiUse } from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import { newGetCpuSpeedInMHz } from "../../system";

chaiUse(sinonChai);

suite("Benchmarking budget system", function() {
  suite("::newGetCpuSpeedInMHz", function() {
    let os: { cpus: SinonStub; };
    let getCpuSpeedInMHz: ReturnType<typeof newGetCpuSpeedInMHz>;

    suiteSetup(function() {
      os = {
        cpus: sinon.stub().returns([
          { speed: 100 },
        ]),
      };

      getCpuSpeedInMHz = newGetCpuSpeedInMHz(os);
    });

    setup(function() {
      os.cpus.resetHistory();
    });

    interface TestCase {
      readonly cpus: ReadonlyArray<CPU>;
      readonly expected: number;
    }

    const scenarios: TestScenarios<TestCase[]> = [
      {
        testName: "even number of CPUs",
        getScenario: () => [
          {
            cpus: [
              { speed: 100 },
              { speed: 200 },
            ],
            expected: 150,
          },
          {
            cpus: [
              { speed: 250 },
              { speed: 350 },
            ],
            expected: 300,
          },
          {
            cpus: [
              { speed: 42 },
              { speed: 43 },
            ],
            expected: 42.5,
          },
        ],
      },
      {
        testName: "uneven number of CPUs",
        getScenario: () => [
          {
            cpus: [
              { speed: 100 },
              { speed: 200 },
              { speed: 300 },
            ],
            expected: 200,
          },
          {
            cpus: [
              { speed: 100 },
              { speed: 300 },
              { speed: 800 },
            ],
            expected: 400,
          },
          {
            cpus: [
              { speed: 100 },
              { speed: 100 },
              { speed: 200 },
            ],
            expected: 133 + (1 / 3),
          },
        ],
      },
    ];

    for (const { getScenario, testName } of scenarios) {
      test(testName, function() {
        for (const { cpus, expected } of getScenario()) {
          os.cpus.returns(cpus);

          const result = getCpuSpeedInMHz();
          expect(result).to.equal(expected);
        }
      });
    }

    test("does not request CPU information before being used", function() {
      expect(os.cpus).not.to.have.been.called;
    });

    test("request CPU information when used", function() {
      getCpuSpeedInMHz();
      expect(os.cpus).to.have.callCount(1);
    });
  });
});
